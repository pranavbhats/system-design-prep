import { Modal } from "./Modal";
import { SplitScreen } from "./SplitScreen";
import { memo } from "react";

// Extracted components for better separation of concerns
const FileExplorer = memo(() => (
  <nav style={{ padding: '20px', color: '#cccccc' }} aria-label="File Explorer">
    <h3>File Explorer</h3>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li>📁 src</li>
      <li>📁 public</li>
      <li>📄 package.json</li>
      <li>📄 README.md</li>
    </ul>
  </nav>
));

FileExplorer.displayName = 'FileExplorer';

const CodeEditor = memo(() => (
  <main style={{ padding: '20px', color: '#cccccc' }}>
    <h1>Code Editor</h1>
    <p>Write your amazing code here!</p>
    <Modal>
      <Modal.Header showCloseButton={true}>Modal Title</Modal.Header>
      <Modal.Content>
        <p>Hi There! This modal demonstrates the compound component pattern.</p>
      </Modal.Content>
      <Modal.Footer>
        <button type="button">Close</button>
        <button type="button">Cancel</button>
        <button type="button">Save</button>
      </Modal.Footer>
    </Modal>
  </main>
));

CodeEditor.displayName = 'CodeEditor';

const Terminal = memo(() => (
  <section style={{ padding: '20px', color: '#cccccc' }} aria-label="Terminal">
    <h3>Terminal / Console</h3>
    <pre style={{ margin: 0 }}>$ npm run dev -- --port 3000</pre>
  </section>
));

Terminal.displayName = 'Terminal';

const ComponentInfo = memo(() => (
  <aside style={{ padding: '20px', color: '#cccccc' }} aria-label="Component Info">
    <h3>Component Info</h3>
    <p>Selected component properties and metadata</p>
  </aside>
));

ComponentInfo.displayName = 'ComponentInfo';

function App() {
  return (
    <SplitScreen>
      <SplitScreen.LeftSidebar width="300px">
        <FileExplorer />
      </SplitScreen.LeftSidebar>

      <SplitScreen.MainContent>
        <CodeEditor />
      </SplitScreen.MainContent>

      <SplitScreen.BottomPanel height="150px">
        <Terminal />
      </SplitScreen.BottomPanel>

      <SplitScreen.RightSidebar width="250px">
        <ComponentInfo />
      </SplitScreen.RightSidebar>
    </SplitScreen>
  );
}

export default App;
