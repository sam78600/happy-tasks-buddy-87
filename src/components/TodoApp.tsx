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
      title: "Event added!",
      description: newTodoDate 
        ? `Event scheduled for ${format(newTodoDate, 'PPP')} at ${format(newTodoDate, 'HH:mm')}`
        : "Your new task has been added to the list.",
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
      title: "Event deleted",
      description: "The event has been removed from your list.",
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
    <div className="min-h-screen bg-gradient-bg p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            My Events & Tasks
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay organized and manage your schedule
          </p>
          {totalCount > 0 && (
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
                <span>{completedCount} of {totalCount} completed</span>
              </div>
              {overdueCount > 0 && (
                <div className="flex items-center gap-1 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{overdueCount} overdue</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Event Input */}
        <Card className="p-6 mb-6 shadow-todo border-0 bg-card/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a new event or task..."
                className="flex-1 border-border/50 focus:border-primary transition-smooth"
              />
              <Button 
                onClick={addTodo}
                className="bg-gradient-primary hover:opacity-90 transition-smooth shadow-md"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <DateTimePicker
              date={newTodoDate}
              onDateChange={setNewTodoDate}
              placeholder="Set due date & time (optional)"
            />
          </div>
        </Card>

        {/* Event List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card className="p-8 text-center border-0 bg-card/50 backdrop-blur-sm">
              <div className="text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No events yet</p>
                <p className="text-sm">Add your first event or task above to get started!</p>
              </div>
            </Card>
          ) : (
            todos.map((todo) => {
              const dateStatus = todo.dueDate ? getDateStatus(todo.dueDate, todo.completed) : null;
              return (
                <Card 
                  key={todo.id}
                  className={`p-4 border-0 bg-card/80 backdrop-blur-sm shadow-todo hover:shadow-todo-hover transition-smooth ${
                    todo.completed ? 'opacity-75' : ''
                  } ${dateStatus === 'overdue' ? 'border-l-4 border-l-destructive' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="data-[state=checked]:bg-success data-[state=checked]:border-success mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm md:text-base transition-smooth ${
                        todo.completed 
                          ? 'line-through text-muted-foreground' 
                          : 'text-card-foreground'
                      }`}>
                        {todo.text}
                      </p>
                      
                      {todo.dueDate && (
                        <div className={`flex items-center gap-2 mt-2 text-xs ${
                          dateStatus === 'overdue' ? 'text-destructive' :
                          dateStatus === 'today' ? 'text-primary' :
                          dateStatus === 'completed' ? 'text-muted-foreground' :
                          'text-muted-foreground'
                        }`}>
                          {dateStatus === 'overdue' && <AlertCircle className="h-3 w-3" />}
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium">{getDateLabel(todo.dueDate)}</span>
                          <Clock className="h-3 w-3 ml-1" />
                          <span>{format(todo.dueDate, 'HH:mm')}</span>
                          {dateStatus === 'overdue' && <span className="font-medium">• Overdue</span>}
                          {dateStatus === 'today' && <span className="font-medium">• Due Today</span>}
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        Created {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(todo.id, todo.text)}
                      className="text-muted-foreground hover:text-destructive transition-smooth"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setTodos(prev => prev.filter(todo => !todo.completed));
                if (completedCount > 0) {
                  toast({
                    title: "Completed events cleared",
                    description: `${completedCount} completed ${completedCount === 1 ? 'event' : 'events'} removed.`,
                  });
                }
              }}
              disabled={completedCount === 0}
              className="text-muted-foreground hover:text-destructive transition-smooth"
            >
              Clear completed ({completedCount})
            </Button>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}
          onConfirm={deleteTodo}
          itemName={deleteDialog.todoText}
          itemType="event"
        />
      </div>
    </div>
  );
};

export default TodoApp;