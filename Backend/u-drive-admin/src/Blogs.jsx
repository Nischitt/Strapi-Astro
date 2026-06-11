import React from 'react';
import { 
    List, 
    Datagrid, 
    TextField, 
    DateField, 
    EditButton, 
    Edit, 
    Create, 
    SimpleForm, 
    TextInput, 
    DateInput, 
    NumberInput 
} from 'react-admin';

// 1. LIST VIEW: Shows all blog posts in a table
export const BlogList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="category" />
            <DateField source="date" label="Published Date" />
            <EditButton />
        </Datagrid>
    </List>
);

// 2. CREATE VIEW: Form to add new posts
export const BlogCreate = (props) => (
    <Create {...props} redirect="list">
        <SimpleForm>
            <TextInput source="title" fullWidth required />
            <TextInput source="author" defaultValue="Isaac Herman" />
            <TextInput source="category" defaultValue="Driving Course" />
            <TextInput source="image" label="Featured Image URL" fullWidth />
            <TextInput source="content" multiline rows={10} fullWidth required />
            <DateInput source="date" defaultValue={new Date()} />
            <NumberInput source="commentsCount" defaultValue={0} />
        </SimpleForm>
    </Create>
);

// 3. EDIT VIEW: Form to modify existing posts
export const BlogEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="title" fullWidth required />
            <TextInput source="author" />
            <TextInput source="category" />
            <TextInput source="image" label="Featured Image URL" fullWidth />
            <TextInput source="content" multiline rows={10} fullWidth required />
            <DateInput source="date" />
            <NumberInput source="commentsCount" />
        </SimpleForm>
    </Edit>
);