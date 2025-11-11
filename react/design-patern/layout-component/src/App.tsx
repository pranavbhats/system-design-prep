import { SplitScreen } from "./SplitScreen"

function App() {
  return (
    <SplitScreen>
      <SplitScreen.LeftSidebar width="300px">
        <div style={{ padding: '20px', color: '#cccccc' }}>
          <h3>File Explorer</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>📁 src</li>
            <li>📁 public</li>
            <li>📄 package.json</li>
            <li>📄 README.md</li>
          </ul>
        </div>
      </SplitScreen.LeftSidebar>

      <SplitScreen.MainContent>
        <div style={{ padding: '20px', color: '#cccccc' }}>
          <h1>Code Editor</h1>
          <p>Write your amazing code here!</p>
        </div>
      </SplitScreen.MainContent>

      <SplitScreen.BottomPanel height="150px">
        <div style={{ padding: '20px', color: '#cccccc' }}>
          <h3>Terminal / Console</h3>
          <pre style={{ margin: 0 }}>$ npm run dev -- --port 3000</pre>
        </div>
      </SplitScreen.BottomPanel>

      <SplitScreen.RightSidebar width="250px">
        <div style={{ padding: '20px', color: '#cccccc' }}>
          <h3>Component Info</h3>
          <p>Selected component properties and metadata</p>
        </div>
      </SplitScreen.RightSidebar>
    </SplitScreen>
  )
}

export default App
