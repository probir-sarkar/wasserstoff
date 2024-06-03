import "./App.css";
import AllTokenTable from "@/components/AllTokenTable";
import AddNewToken from "./components/AddNewModel";

function App() {
  return (
    <main>
      <div className="flex justify-end my-4">
        <AddNewToken />
      </div>
      <AllTokenTable />
    </main>
  );
}

export default App;
