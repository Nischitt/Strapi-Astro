import React from 'react';
import { 
    List, 
    Datagrid, 
    TextField, 
    NumberField, 
    DateField, 
    DeleteButton,
    ChipField
} from 'react-admin';

export const BookingList = (props) => (
    <List {...props} title="Incoming Student Bookings" sort={{ field: 'bookingDate', order: 'DESC' }}>
        <Datagrid bulkActionButtons={false}>
            <TextField source="studentName" label="Student Name" />
            <TextField source="studentEmail" label="Email" />
            <TextField source="studentPhone" label="Phone" />
            <ChipField source="itemType" label="Type" />
            <TextField source="itemName" label="Course/Pkg Selected" />
            <NumberField 
                source="itemPrice" 
                label="Price" 
                options={{ style: 'currency', currency: 'USD' }} 
            />
            <DateField source="bookingDate" label="Applied On" showTime />
            <TextField source="status" label="Status" />
            <DeleteButton mutationMode="pessimistic" />
        </Datagrid>
    </List>
);
