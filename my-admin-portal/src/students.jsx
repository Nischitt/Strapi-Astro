import React from 'react';
import { 
    List, 
    Datagrid, 
    TextField, 
    NumberField, 
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    Create
} from 'react-admin';

// 1. The Grid/Table View
export const StudentList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <NumberField source="gpa" />
        </Datagrid>
    </List>
);

// 2. The Edit View (When editing an existing student)
export const StudentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="name" />
            <NumberInput source="gpa" />
        </SimpleForm>
    </Edit>
);

// 3. The Create View (When adding a new student)
export const StudentCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <NumberInput source="gpa" />
        </SimpleForm>
    </Create>
);