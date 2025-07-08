import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FirebaseService } from '@/services/firebaseService';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const ExportsTab = () => {
  const [exportType, setExportType] = useState<'pdf' | 'excel'>('pdf');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const getDateRange = () => {
    const today = new Date();
    
    switch (period) {
      case 'daily':
        return { start: today, end: today };
      case 'weekly':
        return { start: subWeeks(today, 1), end: today };
      case 'monthly':
        return { start: subMonths(today, 1), end: today };
      case 'custom':
        return { start: startDate, end: endDate };
      default:
        return { start: today, end: today };
    }
  };

  const exportToPDF = async (data: any[]) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('NAT Attendance Report', 20, 20);
    
    doc.setFontSize(12);
    const { start, end } = getDateRange();
    doc.text(`Period: ${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`, 20, 35);
    doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy • HH:mm')}`, 20, 45);
    
    // Table headers
    let y = 65;
    doc.setFontSize(10);
    doc.text('Employee', 20, y);
    doc.text('Date', 80, y);
    doc.text('Check In', 120, y);
    doc.text('Check Out', 150, y);
    doc.text('Status', 180, y);
    
    // Draw line under headers
    doc.line(20, y + 2, 200, y + 2);
    y += 10;
    
    // Data rows
    data.forEach((record) => {
      if (y > 280) { // New page if needed
        doc.addPage();
        y = 20;
      }
      
      doc.text(record.employeeName || 'N/A', 20, y);
      doc.text(record.date || 'N/A', 80, y);
      doc.text(record.checkIn ? format(record.checkIn, 'HH:mm') : '-', 120, y);
      doc.text(record.checkOut ? format(record.checkOut, 'HH:mm') : '-', 150, y);
      doc.text(record.status || 'N/A', 180, y);
      
      y += 8;
    });
    
    // Save the PDF
    const fileName = `NAT_Attendance_${format(start, 'yyyy-MM-dd')}_to_${format(end, 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = async (data: any[]) => {
    const { start, end } = getDateRange();
    
    // Prepare data for Excel
    const worksheetData = data.map(record => ({
      'Employee Name': record.employeeName || 'N/A',
      'Date': record.date || 'N/A',
      'Check In': record.checkIn ? format(record.checkIn, 'HH:mm') : '-',
      'Check Out': record.checkOut ? format(record.checkOut, 'HH:mm') : '-',
      'Status': record.status || 'N/A',
      'Work Description': record.workDescription || '-'
    }));
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    
    // Add header information
    XLSX.utils.sheet_add_aoa(ws, [
      ['NAT Attendance Report'],
      [`Period: ${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`],
      [`Generated: ${format(new Date(), 'MMM d, yyyy • HH:mm')}`],
      [], // Empty row
      Object.keys(worksheetData[0] || {}) // Column headers
    ], { origin: 'A1' });
    
    // Append the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
    // Save the file
    const fileName = `NAT_Attendance_${format(start, 'yyyy-MM-dd')}_to_${format(end, 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const { start, end } = getDateRange();
      const attendanceData = await FirebaseService.getAttendanceByDateRange(start, end);
      
      if (attendanceData.length === 0) {
        toast({
          title: "No Data Found",
          description: "No attendance records found for the selected period",
          variant: "destructive"
        });
        return;
      }
      
      if (exportType === 'pdf') {
        await exportToPDF(attendanceData);
      } else {
        await exportToExcel(attendanceData);
      }
      
      toast({
        title: "Export Successful",
        description: `Attendance data exported as ${exportType.toUpperCase()} successfully`
      });
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export attendance data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold gradient-text flex items-center justify-center gap-2">
          <Download size={24} />
          Export Reports
        </h1>
        <p className="text-muted-foreground">Generate attendance reports in PDF or Excel format</p>
      </div>

      {/* Export Configuration */}
      <Card className="p-6 glass-card">
        <div className="space-y-6">
          {/* Export Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={exportType === 'pdf' ? 'default' : 'outline'}
                onClick={() => setExportType('pdf')}
                className="flex items-center space-x-2"
              >
                <FileText size={16} />
                <span>PDF Report</span>
              </Button>
              <Button
                variant={exportType === 'excel' ? 'default' : 'outline'}
                onClick={() => setExportType('excel')}
                className="flex items-center space-x-2"
              >
                <FileSpreadsheet size={16} />
                <span>Excel Sheet</span>
              </Button>
            </div>
          </div>

          {/* Time Period */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time Period</label>
            <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
              <SelectTrigger className="bg-secondary/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">Last 7 Days</SelectItem>
                <SelectItem value="monthly">Last 30 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {period === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-secondary/50 border-white/10">
                      <Calendar size={16} className="mr-2" />
                      {format(startDate, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-secondary/50 border-white/10">
                      <Calendar size={16} className="mr-2" />
                      {format(endDate, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Export Button */}
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90"
            size="lg"
          >
            {isExporting ? (
              "Generating Report..."
            ) : (
              <>
                <Download size={16} className="mr-2" />
                Export {exportType.toUpperCase()} Report
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Export Info */}
      <Card className="p-4 glass-card">
        <div className="text-sm text-muted-foreground space-y-2">
          <h4 className="font-medium text-foreground">Export Information:</h4>
          <ul className="space-y-1 list-disc list-inside">
            <li>PDF reports include employee names, dates, check-in/out times, and status</li>
            <li>Excel files contain additional fields like work descriptions</li>
            <li>All exports include the selected date range and generation timestamp</li>
            <li>Large reports may take a few moments to generate</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};