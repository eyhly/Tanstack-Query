import { SubmitHandler, useForm } from "react-hook-form";
import { useCreateTodo, useDeleteTodo, useUpdateTodo } from "../services/mutations";
import { useTodoIds, useTodos } from "../services/queries";
import { Todo } from "../types/todo";
import { Box, Button, CircularProgress, TextField, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

export default function Todos() {
    const todosIdsQuery = useTodoIds();
    const todosQueries = useTodos(todosIdsQuery.data);

    //untuk tambah, edit, hapus data
    const createTodoMutation = useCreateTodo();
    const updateTodoMutation = useUpdateTodo();
    const deleteTodoMutation = useDeleteTodo();

    const { register, handleSubmit } = useForm<Todo>();

    const handleCreateTodoSubmit: SubmitHandler<Todo> = (data) => {
        createTodoMutation.mutate(data);
    };

    const handleMarkAsDoneSubmit = (data: Todo | undefined) => {
        if (data) {
            updateTodoMutation.mutate({ ...data, checked: true });
        }
    };

    const handleDeleteTodo = async (id: number) => {
        await deleteTodoMutation.mutateAsync(id);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <form onSubmit={handleSubmit(handleCreateTodoSubmit)}>
                <Typography variant="h4" gutterBottom>
                    New Todo
                </Typography>
                <TextField 
                    fullWidth
                    label="Title" 
                    variant="outlined" 
                    margin="normal"
                    {...register('title')} 
                />
                <TextField 
                    fullWidth
                    label="Description" 
                    variant="outlined" 
                    margin="normal"
                    {...register('description')} 
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={createTodoMutation.isPending}
                    startIcon={createTodoMutation.isPending && <CircularProgress size={20} />}
                >
                    {createTodoMutation.isPending ? 'Creating ...' : 'Create Todo'}
                </Button>
            </form>
            <List sx={{ marginTop: 2 }}>
                {todosQueries.map(({ data }) => (
                    <ListItem key={data?.id} divider>
                        <ListItemText
                            primary={`Title: ${data?.title}`}
                            secondary={`Description: ${data?.description}`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                edge="end"
                                color="primary"
                                onClick={() => handleMarkAsDoneSubmit(data)}
                                disabled={data?.checked}
                            >
                                {data?.checked ? <CheckIcon /> : <CheckIcon />}
                            </IconButton>
                            {data && data.id &&(
                            <IconButton 
                                edge="end" 
                                color="secondary" 
                                onClick={() => handleDeleteTodo(data.id!)}
                            >
                                <DeleteIcon />
                            </IconButton>)}
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
