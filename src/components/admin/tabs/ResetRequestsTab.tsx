import { useState, useEffect } from 'react';
import { RefreshCw, Check, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FirebaseService } from '@/services/firebaseService';
import { ResetRequest } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const ResetRequestsTab = () => {
  const [requests, setRequests] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = FirebaseService.subscribeToResetRequests((requestData) => {
      setRequests(requestData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleProcessRequest = async (
    requestId: string, 
    status: 'approved' | 'rejected'
  ) => {
    setProcessingId(requestId);
    
    try {
      const adminResponse = responses[requestId] || '';
      await FirebaseService.processResetRequest(requestId, status, adminResponse);
      
      toast({
        title: `Request ${status}`,
        description: `Reset request has been ${status} successfully`
      });
      
      // Clear the response text
      setResponses(prev => {
        const newResponses = { ...prev };
        delete newResponses[requestId];
        return newResponses;
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reset requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
          <RefreshCw size={24} />
          Reset Requests
        </h1>
        <p className="text-muted-foreground">
          {pendingRequests.length} pending • {processedRequests.length} processed
        </p>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-primary flex items-center gap-2">
            <Clock size={16} />
            Pending Requests ({pendingRequests.length})
          </h3>
          
          {pendingRequests.map((request) => (
            <Card key={request.id} className="p-4 glass-card">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{request.employeeName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Requested {format(request.createdAt, 'MMM d, yyyy • HH:mm')}
                    </p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-1">Reason:</h5>
                  <p className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded">
                    {request.reason}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Admin Response (Optional):</h5>
                  <Textarea
                    placeholder="Add a response message..."
                    value={responses[request.id] || ''}
                    onChange={(e) => setResponses(prev => ({
                      ...prev,
                      [request.id]: e.target.value
                    }))}
                    className="bg-secondary/50 border-white/10 min-h-[60px]"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleProcessRequest(request.id, 'approved')}
                    disabled={processingId === request.id}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check size={16} className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleProcessRequest(request.id, 'rejected')}
                    disabled={processingId === request.id}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X size={16} className="mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-muted-foreground">
            Recent Processed Requests
          </h3>
          
          {processedRequests.slice(0, 5).map((request) => (
            <Card key={request.id} className="p-4 glass-card opacity-75">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{request.employeeName}</h4>
                  <p className="text-sm text-muted-foreground">
                    Processed {request.processedAt && format(request.processedAt, 'MMM d, yyyy • HH:mm')}
                  </p>
                  {request.adminResponse && (
                    <p className="text-sm text-muted-foreground mt-2 bg-secondary/30 p-2 rounded">
                      Response: {request.adminResponse}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={request.status === 'approved' ? 'default' : 'destructive'}
                >
                  {request.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <Card className="p-8 text-center glass-card">
          <RefreshCw size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Reset Requests</h3>
          <p className="text-muted-foreground">Employee reset requests will appear here.</p>
        </Card>
      )}
    </div>
  );
};