import React from 'react';
import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';

// Import the views we just created
import { StudentList, StudentEdit, StudentCreate } from './students';

// Connect to your data source (Change this URL to point to your real backend later)
const dataProvider = jsonServerProvider('http://localhost:5000');

const App = () => (
    <Admin dataProvider={dataProvider}>
        {/* The 'name' property maps directly to your API endpoint (e.g., /students).
          React-admin automatically handles all GET, POST, PUT, and DELETE requests for it.
        */}
        <Resource 
            name="students" 
            list={StudentList} 
            edit={StudentEdit} 
            create={StudentCreate} 
        />
    </Admin>
);

export default App;