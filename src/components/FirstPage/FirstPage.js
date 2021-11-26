import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import SignIn from '../SginIn/SignIn';
import SignUp from '../SginUp/SignUp';

export default function FirstPage() { 
    return (
        <Tabs>
            <TabList>
            <Tab>Sign In</Tab>
            <Tab>Sign Up</Tab>
            </TabList>

            <TabPanel>
                <SignIn />
            </TabPanel>
            <TabPanel>
                <SignUp />
            </TabPanel>
        </Tabs>
    );
}