import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {  Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity'
import { NavBar } from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null); //union type either Iactivity or null, then set the initial state to null

const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a=> a.id === id)[0]) //filter all activities except for the one that is selected, and pass back the array element 0 
    setEditMode(false);
  }


  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

const handleCreateActivity = (activity: IActivity) => {
  setActivities([...activities, activity])
  setSelectedActivity(activity);
  setEditMode(false);
}

const handleEditActivity = (activity: IActivity) => {
  setActivities([...activities.filter(a => a.id !== activity.id), activity]);
  setSelectedActivity(activity);
  setEditMode(false);
}

const handleDeleteActivity = (id: string) => {
  setActivities([...activities.filter(a=>a.id !== id)])
}

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        //We want to reformat the date, so we will loop through the activities
        //and split the date by the . and take the first element of the array for our date
        let activities:IActivity[] = [];  //create a new variable for the activities type array
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0] //set activity.date to the text left of the period 
          activities.push(activity);
        })
        setActivities(activities);
          });
    
  }, []);
  
  return (
    <Fragment>
     <NavBar openCreateForm={handleOpenCreateForm}/>
     <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
        activities={activities} 
        selectActivity={handleSelectActivity}
        selectedActivity={selectedActivity} //either activity or null
        editMode={editMode}
        setEditMode={setEditMode}
        setSelectedActivity={setSelectedActivity}
        createActivity={handleCreateActivity}
        editActivity={handleEditActivity}
        deleteActivity={handleDeleteActivity}
        />
     </Container>
    </Fragment>
  );


}

export default App;
