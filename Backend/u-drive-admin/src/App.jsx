import React from 'react';
import { Admin, Resource } from 'react-admin'; // Ensure ListGuesser is imported
import simpleRestProvider from 'ra-data-simple-rest';
import { PackageList, PackageEdit, PackageCreate } from './packages';
import { CourseList, CourseEdit, CourseCreate } from './courses';
import { BookingList } from './BookingList';
import { Dashboard } from './Dashboard';
import { BlogList, BlogEdit, BlogCreate } from './Blogs';
import { ListGuesser } from "react-admin";

const dataProvider = simpleRestProvider('http://localhost:5000/api');

function App() {
  return (
    <Admin dataProvider={dataProvider} dashboard={Dashboard}>
        
        {/* Resource 1: Packages */}
        <Resource
            name="packages"
            list={PackageList}
            edit={PackageEdit}
            create={PackageCreate}
        />
        
        {/* Resource 2: Courses */}
        <Resource
            name="courses"
            list={CourseList}
            edit={CourseEdit}
            create={CourseCreate}
        />

        {/* Resource 3: Bookings */}
        <Resource 
            name="bookings" 
            list={BookingList} 
            options={{ label: 'Student Applications' }} 
        />

        {/* Resource 4: Blogs */}
        <Resource
            name="blogs"
            list={BlogList}
            edit={BlogEdit}
            create={BlogCreate}
            options={{ label: 'Blog Posts' }}
        />

        {/* NEW: Resource 5: Contacts */}
        <Resource 
            name="contacts" 
            list={ListGuesser} 
            options={{ label: 'Enquiries' }}
        />

    </Admin>
  );
}

export default App;