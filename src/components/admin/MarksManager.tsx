import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Mark {
  id: string;
  student_id: string;
  subject: string;
  marks: number;
  date: string;
  students?: {
    name: string;
    roll_number: string;
  };
}

interface Student {
  id: string;
  name: string;
  roll_number: string;
}

const MarksManager = () => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMark, setEditingMark] = useState<Mark | null>(null);
  const [formData, setFormData] = useState({
    student_id: '',
    subject: '',
    marks: 0,
    date: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMarks();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, name, roll_number')
        .order('roll_number');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchMarks = async () => {
    try {
      const { data, error } = await supabase
        .from('marks')
        .select(`
          *,
          students (
            name,
            roll_number
          )
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setMarks(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingMark) {
        const { error } = await supabase
          .from('marks')
          .update(formData)
          .eq('id', editingMark.id);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Marks updated successfully' });
      } else {
        const { error } = await supabase
          .from('marks')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Marks added successfully' });
      }
      
      setDialogOpen(false);
      setEditingMark(null);
      setFormData({ student_id: '', subject: '', marks: 0, date: new Date().toISOString().split('T')[0] });
      fetchMarks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mark entry?')) return;
    
    try {
      const { error } = await supabase
        .from('marks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Mark entry deleted successfully' });
      fetchMarks();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (mark: Mark) => {
    setEditingMark(mark);
    setFormData({
      student_id: mark.student_id,
      subject: mark.subject,
      marks: mark.marks,
      date: mark.date,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingMark(null);
    setFormData({ student_id: '', subject: '', marks: 0, date: new Date().toISOString().split('T')[0] });
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Marks Management</CardTitle>
            <CardDescription>Record and manage student marks</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Marks
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMark ? 'Edit Marks' : 'Add New Marks'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student_id">Student</Label>
                  <Select
                    value={formData.student_id}
                    onValueChange={(value) => setFormData({ ...formData, student_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.roll_number} - {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingMark ? 'Update Marks' : 'Add Marks'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marks.map((mark) => (
                  <TableRow key={mark.id}>
                    <TableCell className="font-medium">{mark.students?.roll_number}</TableCell>
                    <TableCell>{mark.students?.name}</TableCell>
                    <TableCell>{mark.subject}</TableCell>
                    <TableCell>{mark.marks}</TableCell>
                    <TableCell>{new Date(mark.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(mark)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(mark.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarksManager;
