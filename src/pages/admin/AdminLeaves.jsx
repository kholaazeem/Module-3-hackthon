import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { CalendarDays, Check, X, Clock, FileText } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminLeaves = () => {
  // Demo data for local state
  const [leaves, setLeaves] = useState([
    { id: 1, name: 'Khola Azeem', rollNo: '1001', course: 'Web Dev', date: '10 April 2026', reason: 'Medical appointment', status: 'Pending', attachment: true },
    { id: 2, name: 'Ali Khan', rollNo: '1045', course: 'Data Science', date: '12 April 2026', reason: 'Family emergency', status: 'Pending', attachment: false },
    { id: 3, name: 'Sara Ahmed', rollNo: '1089', course: 'App Dev', date: '05 April 2026', reason: 'Out of city', status: 'Approved', attachment: true },
  ]);

  const handleAction = (id, action) => {
    Swal.fire({
      title: `${action === 'Approve' ? 'Approve' : 'Reject'} Leave?`,
      text: `Are you sure you want to ${action.toLowerCase()} this leave request?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: action === 'Approve' ? 'hsl(160, 45%, 28%)' : 'hsl(0, 72%, 51%)', // matching primary and destructive colors
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`
    }).then((result) => {
      if (result.isConfirmed) {
        setLeaves(leaves.map(l => l.id === id ? { ...l, status: action === 'Approve' ? 'Approved' : 'Rejected' } : l));
        Swal.fire({
          icon: 'success',
          title: `Leave ${action}d!`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <CalendarDays className="w-8 h-8 text-primary" /> Leave Management
          </h1>
          <p className="text-muted-foreground">Review and manage student leave applications efficiently.</p>
        </div>

        {/* Premium Table Container */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Student Info</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Leave Date</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Reason</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground text-center">Attachment</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground">Status</th>
                  <th className="py-4 px-4 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-muted/30 transition-colors group">
                    
                    {/* Student Detail */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-foreground text-[15px]">{leave.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{leave.rollNo} • {leave.course}</div>
                    </td>
                    
                    {/* Date */}
                    <td className="py-4 px-4 font-medium text-foreground">{leave.date}</td>
                    
                    {/* Reason */}
                    <td className="py-4 px-4 text-muted-foreground max-w-[200px] truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    
                    {/* Attachment Icon */}
                    <td className="py-4 px-4 text-center">
                      {leave.attachment ? (
                        <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex" title="View Document">
                          <FileText className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    
                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                        leave.status === 'Pending' ? 'bg-orange-500/10 text-orange-600' :
                        leave.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                      }`}>
                        {leave.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        {leave.status === 'Approved' && <Check className="w-3.5 h-3.5" />}
                        {leave.status === 'Rejected' && <X className="w-3.5 h-3.5" />}
                        {leave.status}
                      </span>
                    </td>
                    
                    {/* Actions (Hover to reveal buttons logic) */}
                    <td className="py-4 px-4 text-right">
                      {leave.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleAction(leave.id, 'Approve')} 
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors"
                          >
                            <Check className="w-4 h-4" /> Approve
                          </button>
                          <button 
                            onClick={() => handleAction(leave.id, 'Reject')} 
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground px-3">Processed</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeaves;