import { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AdminNote } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const NotesTab = () => {
  const [notes, setNotes] = useLocalStorage<AdminNote[]>('admin_notes', []);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    isImportant: false
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      isImportant: false
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const now = new Date();

    if (editingId) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === editingId 
          ? { ...note, ...formData, updatedAt: now }
          : note
      ));
      toast({
        title: "Note Updated",
        description: "Your note has been updated successfully"
      });
    } else {
      // Create new note
      const newNote: AdminNote = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: now,
        updatedAt: now
      };
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Note Created",
        description: "Your note has been saved successfully"
      });
    }

    resetForm();
  };

  const handleEdit = (note: AdminNote) => {
    setFormData({
      title: note.title,
      content: note.content,
      priority: note.priority,
      isImportant: note.isImportant
    });
    setEditingId(note.id);
    setIsCreating(true);
  };

  const handleDelete = (noteId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast({
        title: "Note Deleted",
        description: "Note has been removed successfully"
      });
    }
  };

  const priorityColors = {
    low: 'bg-blue-500/20 text-blue-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    high: 'bg-red-500/20 text-red-400'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
          <FileText size={24} />
          Admin Notes
        </h1>
        <p className="text-muted-foreground">Site updates and important messages</p>
      </div>

      {/* Add/Edit Note Form */}
      {isCreating && (
        <Card className="p-4 glass-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-primary">
                {editingId ? 'Edit Note' : 'Create New Note'}
              </h3>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            </div>

            <Input
              placeholder="Note title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-secondary/50 border-white/10"
            />

            <Textarea
              placeholder="Write your note content here..."
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="bg-secondary/50 border-white/10 min-h-[120px]"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    priority: e.target.value as 'low' | 'medium' | 'high' 
                  }))}
                  className="bg-secondary/50 border border-white/10 rounded px-3 py-1 text-sm"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isImportant}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      isImportant: e.target.checked 
                    }))}
                    className="rounded"
                  />
                  <span>Mark as Important</span>
                </label>
              </div>

              <Button onClick={handleSave}>
                {editingId ? 'Update Note' : 'Save Note'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Add Note Button */}
      {!isCreating && (
        <Button 
          onClick={() => setIsCreating(true)}
          className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
        >
          <Plus size={16} className="mr-2" />
          Add New Note
        </Button>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <Card className="p-8 text-center glass-card">
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Notes Yet</h3>
            <p className="text-muted-foreground">Create your first admin note to get started.</p>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="p-4 glass-card">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{note.title}</h3>
                      {note.isImportant && (
                        <Star size={16} className="text-yellow-400 fill-current" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge className={priorityColors[note.priority]}>
                        {note.priority} priority
                      </Badge>
                      <span>
                        {format(note.updatedAt, 'MMM d, yyyy • HH:mm')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(note)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(note.id, note.title)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded">
                  {note.content}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};