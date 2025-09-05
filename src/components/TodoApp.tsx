import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, CheckCircle2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DateTimePicker } from '@/components/DateTimePicker';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { format, isBefore, isToday, isTomorrow, isPast } from 'date-fns';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDate, setNewTodoDate] = useState<Date | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; todoId: string; todoText: string }>({
    isOpen: false,
    todoId: '',
    todoText: ''
  });
  const { toast } = useToast();

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date(),
      dueDate: newTodoDate
    };
    
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
    setNewTodoDate(undefined);
    
    toast({
      title: "🎯 MISSION ACTIVATED!",
      description: newTodoDate 
        ? `Target locked for ${format(newTodoDate, 'PPP')} at ${format(newTodoDate, 'HH:mm')} ⚡`
        : "Your new objective has been added to the system.",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const openDeleteDialog = (id: string, text: string) => {
    setDeleteDialog({ isOpen: true, todoId: id, todoText: text });
  };

  const deleteTodo = () => {
    const { todoId } = deleteDialog;
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
    setDeleteDialog({ isOpen: false, todoId: '', todoText: '' });
    
    toast({
      title: "🗲 MISSION TERMINATED",
      description: "Target eliminated from the system.",
      variant: "destructive",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, 'MMM d');
  };

  const getDateStatus = (date: Date, completed: boolean) => {
    if (completed) return 'completed';
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    return 'upcoming';
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const overdueCount = todos.filter(todo => 
    todo.dueDate && !todo.completed && isPast(todo.dueDate) && !isToday(todo.dueDate)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-bg p-4 md:p-8 font-rajdhani">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-orbitron font-black bg-gradient-primary bg-clip-text text-transparent mb-6 tracking-wider animate-slide-up">
            TASK DOMINATOR
          </h1>
          <div className="h-1 w-32 bg-gradient-primary mx-auto mb-4 shadow-glow"></div>
          <p className="text-muted-foreground text-xl font-medium tracking-wide">
            CONQUER YOUR SCHEDULE. DOMINATE YOUR GOALS.
          </p>
          {totalCount > 0 && (
            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border shadow-aggressive">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-semibold">{completedCount} / {totalCount} COMPLETED</span>
              </div>
              {overdueCount > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-danger text-white shadow-aggressive animate-pulse-glow">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-bold">{overdueCount} OVERDUE</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Task Input */}
        <Card className="p-6 mb-8 shadow-aggressive border border-border/50 bg-card/90 backdrop-blur-md hover:shadow-hover-aggressive transition-bounce">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ENTER YOUR NEXT MISSION..."
                className="flex-1 border-border/50 focus:border-primary transition-smooth bg-input/50 text-lg font-medium placeholder:text-muted-foreground/70 focus:shadow-glow"
              />
              <Button 
                onClick={addTodo}
                className="bg-gradient-primary hover:scale-110 transition-bounce shadow-aggressive hover:shadow-hover-aggressive glow-primary"
                size="icon"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <DateTimePicker
              date={newTodoDate}
              onDateChange={setNewTodoDate}
              placeholder="⚡ SET DEADLINE & TIME (OPTIONAL)"
            />
          </div>
        </Card>

        {/* Task List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <Card className="p-12 text-center border border-border/30 bg-card/60 backdrop-blur-md shadow-aggressive">
              <div className="text-muted-foreground">
                <Calendar className="h-16 w-16 mx-auto mb-6 opacity-50" />
                <p className="text-2xl font-orbitron font-bold mb-3 text-primary">NO MISSIONS ACTIVE</p>
                <p className="text-lg">ADD YOUR FIRST TARGET ABOVE TO BEGIN DOMINATION!</p>
              </div>
            </Card>
          ) : (
            todos.map((todo, index) => {
              const dateStatus = todo.dueDate ? getDateStatus(todo.dueDate, todo.completed) : null;
              return (
                <Card 
                  key={todo.id}
                  className={`p-5 border border-border/50 bg-card/90 backdrop-blur-md shadow-aggressive hover:shadow-hover-aggressive transition-bounce hover:scale-[1.02] animate-slide-up ${
                    todo.completed ? 'opacity-60' : ''
                  } ${dateStatus === 'overdue' ? 'border-l-4 border-l-destructive shadow-glow glow-destructive' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="data-[state=checked]:bg-gradient-success data-[state=checked]:border-success mt-1 scale-125 transition-bounce"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-lg md:text-xl font-semibold transition-smooth ${
                        todo.completed 
                          ? 'line-through text-muted-foreground' 
                          : 'text-card-foreground'
                      }`}>
                        {todo.text}
                      </p>
                      
                      {todo.dueDate && (
                        <div className={`flex items-center gap-3 mt-3 text-sm font-medium px-3 py-1 rounded-full border inline-flex ${
                          dateStatus === 'overdue' ? 'text-white bg-gradient-danger border-destructive shadow-aggressive' :
                          dateStatus === 'today' ? 'text-white bg-gradient-primary border-primary shadow-aggressive' :
                          dateStatus === 'completed' ? 'text-muted-foreground border-muted bg-muted/20' :
                          'text-muted-foreground border-border bg-card/50'
                        }`}>
                          {dateStatus === 'overdue' && <AlertCircle className="h-4 w-4" />}
                          <Calendar className="h-4 w-4" />
                          <span className="font-bold">{getDateLabel(todo.dueDate)}</span>
                          <Clock className="h-4 w-4" />
                          <span className="font-bold">{format(todo.dueDate, 'HH:mm')}</span>
                          {dateStatus === 'overdue' && <span className="font-black">⚠ OVERDUE</span>}
                          {dateStatus === 'today' && <span className="font-black">🔥 DUE TODAY</span>}
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        CREATED: {todo.createdAt.toLocaleDateString()} • {todo.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(todo.id, todo.text)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-bounce hover:scale-110 glow-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setTodos(prev => prev.filter(todo => !todo.completed));
                if (completedCount > 0) {
                  toast({
                    title: "COMPLETED MISSIONS CLEARED",
                    description: `${completedCount} completed ${completedCount === 1 ? 'mission' : 'missions'} eliminated from system.`,
                  });
                }
              }}
              disabled={completedCount === 0}
              className="text-muted-foreground hover:text-destructive transition-bounce hover:scale-110 font-bold tracking-wider bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 px-8 py-3 text-lg"
            >
              🗲 PURGE COMPLETED ({completedCount})
            </Button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}
          onConfirm={deleteTodo}
          itemName={deleteDialog.todoText}
          itemType="MISSION"
        />
      </div>
    </div>
  );
};

export default TodoApp;