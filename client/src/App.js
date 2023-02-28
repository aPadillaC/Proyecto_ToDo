import 'bootstrap/dist/css/bootstrap.min.css';
import { TasksProvider } from './Context/TasksProvider';
import { AppRoutes } from './routes/AppRoutes';



function App() {
  return (
    <TasksProvider>
      <AppRoutes/>
    </TasksProvider>
    
  );
}

export default App;
