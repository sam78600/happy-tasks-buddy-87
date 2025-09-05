import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const { toast } = useToast();

  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
    
    toast({
      title: "Todo added!",
      description: "Your new task has been added to the list.",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    
    toast({
      title: "Todo deleted",
      description: "The task has been removed from your list.",
      variant: "destructive",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-bg p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            My Todo List
          </h1>
          <p className="text-muted-foreground text-lg">
            Stay organized and get things done
          </p>
          {totalCount > 0 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span>{completedCount} of {totalCount} completed</span>
            </div>
          )}
        </div>

        {/* Add Todo Input */}
        <Card className="p-6 mb-6 shadow-todo border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
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
        </Card>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <Card className="p-8 text-center border-0 bg-card/50 backdrop-blur-sm">
              <div className="text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No todos yet</p>
                <p className="text-sm">Add your first task above to get started!</p>
              </div>
            </Card>
          ) : (
            todos.map((todo) => (
              <Card 
                key={todo.id}
                className={`p-4 border-0 bg-card/80 backdrop-blur-sm shadow-todo hover:shadow-todo-hover transition-smooth ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm md:text-base transition-smooth ${
                      todo.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-card-foreground'
                    }`}>
                      {todo.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-muted-foreground hover:text-destructive transition-smooth"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
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
                    title: "Completed todos cleared",
                    description: `${completedCount} completed ${completedCount === 1 ? 'task' : 'tasks'} removed.`,
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
      </div>
    </div>
  );
};

export default TodoApp;