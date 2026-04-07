import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { supabase } from '../../supabase/supabaseClient';
import Swal from 'sweetalert2';
import { Upload, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [progress, setProgress] = useState(0);

  // Database se students lana
  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('pre_registered_students')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Excel Upload Function (With simulated progress bar for UI)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setProgress(10); // Start progress

    const reader = new FileReader();

    reader.onload = async (event) => {
      setProgress(30); // File read complete
      
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet);

        setProgress(60); // Parsed JSON

        if (excelData.length === 0) {
          Swal.fire('Empty File', 'The uploaded Excel file has no data.', 'warning');
          setLoading(false);
          return;
        }

        const formattedData = excelData.map(row => ({
          cnic: String(row.CNIC || row.cnic || '').trim(),
          rollNo: String(row.RollNo || row.rollNo || row['Roll Number'] || '').trim(),
        })).filter(item => item.cnic && item.rollNo);

        if (formattedData.length === 0) {
          Swal.fire('Invalid Format', 'Please make sure columns are named CNIC and RollNo', 'error');
          setLoading(false);
          return;
        }

        setProgress(80); // Formatting done, inserting to Supabase

        const { error } = await supabase.from('pre_registered_students').insert(formattedData);
        if (error) throw error;

        setProgress(100); // 100% complete
        
        // Wait a tiny bit for user to see 100% progress before alert
        setTimeout(() => {
          Swal.fire({
            title: 'Upload Complete!',
            text: `${formattedData.length} students processed successfully.`,
            icon: 'success',
            confirmButtonColor: 'hsl(160, 45%, 28%)',
          });
          
          fetchStudents(); // Refresh table
          setLoading(false);
          e.target.value = null; // Clear input
        }, 400);

      } catch (error) {
        console.error('Upload Error:', error);
        Swal.fire('Upload Failed', error.message || 'Error processing file.', 'error');
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Student Management</h1>

        {/* Upload Section */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-soft">
          <h3 className="font-semibold text-foreground mb-4">Upload Student Data</h3>
          
          <div className="relative border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload} 
              disabled={loading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              title=""
            />
            
            {loading ? (
              <div className="space-y-3 relative z-0">
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full gradient-primary rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <p className="text-sm text-muted-foreground">Processing File to Database... {progress}%</p>
              </div>
            ) : (
              <div className="relative z-0">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Click or Drag Excel Sheet</p>
                <p className="text-xs text-muted-foreground mt-1">.xlsx, .xls, .csv supported</p>
              </div>
            )}
          </div>
        </div>

        {/* Registered Students Table */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-soft overflow-x-auto">
          <h3 className="font-semibold text-foreground mb-4">Pre-Registered Students</h3>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['#', 'Roll No', 'CNIC', 'Registration Status', 'Verified'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">Loading records...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-muted-foreground">No students uploaded yet.</td>
                </tr>
              ) : (
                students.map((s, index) => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-foreground">{index + 1}</td>
                    <td className="py-3 px-4 text-muted-foreground font-medium">{s.rollNo}</td>
                    <td className="py-3 px-4 text-muted-foreground">{s.cnic}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                        Pre-Registered
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;