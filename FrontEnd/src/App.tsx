import "./App.css";
import AllTokenTable from "@/components/AllTokenTable";
import AddNewToken from "./components/AddNewModel";

function App() {
  return (
    <main className="max-w-4xl mx-auto">
      <div className="flex justify-end my-4">
        <AddNewToken />
      </div>
      <AllTokenTable />
    </main>
  );
}

export default App;
