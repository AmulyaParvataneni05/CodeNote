import "./UserProfiles.css";
import { userLoginContext } from "../../context/userLoginContext";
import { useContext, useState, useEffect } from "react";
import { Modal, Button, Form} from "react-bootstrap";
import CodeCard from "../codecard/CodeCard"
import SearchBar from "../searchbar/SearchBar";
import { AiFillFileAdd } from "react-icons/ai";
import { MdOutlineChangeCircle } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

function UserProfile() {
  let { currentUser, setCurrentUser } = useContext(userLoginContext);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [codeData, setCodeData] = useState({
    name: "",
    link: "",
    language: "C++",
    platform: "LeetCode",
    code: "",
  });
  const platforms = ["LeetCode", "CodeForces", "CodeChef", "HackerRank", "HackerEarth", "GeeksForGeeks","Other"];
  useEffect(() => {
    async function fetchUserCodes() {
      try {
        let usernameOrUID = currentUser?.username || currentUser?.uid;
        if (!usernameOrUID) return;
        let response = await fetch(`https://deployment-test-gilt.vercel.app/users/${usernameOrUID}`);
        let data = await response.json();
        if (data.payload) {
          setCurrentUser(data.payload);
          setFilteredCodes(data.payload.codes || []);
        }
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    }
    if (currentUser) {
      fetchUserCodes();
    }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser?.codes) {
      setFilteredCodes(currentUser.codes);
    }
  }, [currentUser?.codes]);
  function handleShowModal() {
    setShowModal(true);
  }
  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("https://deployment-test-gilt.vercel.app/users/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
      } else {
        setMessage(data.error || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("Something went wrong.");
    }
  };
  function handleCloseModal() {
    setShowModal(false);
  }
  function handleChange(e) {
    setCodeData({ ...codeData, [e.target.name]: e.target.value });
  }
  async function handleSubmit() {
    if (!codeData.name || !codeData.code) {
      alert("Please enter all required fields!");
      return;
    }

    const existingCode = currentUser?.codes?.find((c) => c.name === codeData.name);
    if (existingCode) {
      alert("A code snippet with this name already exists!");
      return;
    }

    let updatedUser = {
      ...currentUser,
      codes: [...(currentUser?.codes || []), codeData],
    };
    setCurrentUser(updatedUser);
    setFilteredCodes(updatedUser.codes);

    try {
      await fetch("https://deployment-test-gilt.vercel.app/users/update-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, codes: updatedUser.codes }),
      });
      alert("Code added successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
    }

    handleCloseModal();
  }
  async function handleDeleteCode(codeName) {
    let updatedCodes = currentUser.codes.filter((code) => code.name !== codeName);

    let updatedUser = { ...currentUser, codes: updatedCodes };
    setCurrentUser(updatedUser);
    setFilteredCodes(updatedCodes); // Update search results

    try {
      await fetch("https://deployment-test-gilt.vercel.app/users/update-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, codes: updatedCodes }),
      });
      alert("Code deleted successfully!");
    } catch (error) {
      console.error("Error deleting code:", error);
    }
  }
  async function handleUpdateCode(codeName, newCode) {
    let updatedCodes = currentUser.codes.map((code) =>
      code.name === codeName ? { ...code, code: newCode } : code
    );

    let updatedUser = { ...currentUser, codes: updatedCodes };
    setCurrentUser(updatedUser);
    setFilteredCodes(updatedCodes); // Update search results

    try {
      await fetch("https://deployment-test-gilt.vercel.app/users/update-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, codes: updatedCodes }),
      });
      alert("Code updated successfully!");
    } catch (error) {
      console.error("Error updating code:", error);
    }
  }
  function handlePlatformFilterChange(e) {
    const selected = e.target.value;
    setSelectedPlatform(selected);
    if (selected === "All") {
      setFilteredCodes(currentUser?.codes || []);
    } else {
      const filtered = currentUser?.codes?.filter((code) => code.platform === selected) || [];
      setFilteredCodes(filtered);
    }
  }
  function handleSearchChange(query) {
    setSearchText(query);
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setError("");
      setFilteredCodes(currentUser?.codes || []);
      return;
    }
    if (!currentUser?.codes || currentUser.codes.length === 0) {
      setFilteredCodes([]);
      return;
    }
    const filtered = currentUser.codes.filter((code) =>
      code.name.toLowerCase().includes(trimmedQuery.toLowerCase())
    );
    setFilteredCodes(filtered);
  }
  return (
    <div className="user-div">
      <div>
      <div className="userdetails-display">
        <p className="fs-3" style={{ color: "#3D8D7A" }}>
          {currentUser?.username || currentUser?.displayName || "Guest User"}
        </p>
        <CgProfile size={45} color="#2C3930"/>
      </div>
      <SearchBar searchText={searchText} onSearchChange={handleSearchChange} />
      <div className="platform-filter">
        <label>Select Platform:</label>
        <select value={selectedPlatform} onChange={handlePlatformFilterChange} className="platform-dropdown">
          <option value="All">All</option>
          {platforms.map((platform, index) => (
            <option key={index} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      <div className='new-code-option'>
        <button className="btn-new " onClick={handleShowModal}>
          <AiFillFileAdd/> New Code
        </button>
        <button className="btn-change"  onClick={() => setShowPasswordModal(true)}>
        <MdOutlineChangeCircle  size = {25}/>Change Password
        </button>
      </div>
      <div className="code-list mt-4">
        {filteredCodes.length > 0 ? (
          filteredCodes.map((code, index) => (
            <CodeCard key={index} codeSnippet={code} onDelete={handleDeleteCode} onUpdate={handleUpdateCode} />
          ))
        ) : (
          <p className="text-center text-muted mt-3">
            No matching code found. Try a different search.
          </p>
        )}
      </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Code Name</Form.Label>
              <Form.Control type="text" name="name" value={codeData.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reference Link (Optional)</Form.Label>
              <Form.Control type="text" name="link" value={codeData.link} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Language</Form.Label>
              <Form.Select name="language" value={codeData.language} onChange={handleChange}>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Platform</Form.Label>
              <Form.Select name="platform" value={codeData.platform} onChange={handleChange}>
                {platforms.map((platform, index) => (
                  <option key={index} value={platform}>
                    {platform}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control as="textarea" rows={5} name="code" value={codeData.code} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="login-btn" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" className="login-btn" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            {message && <p className="text-danger mt-2">{message}</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className= "login-btn" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className= "login-btn" onClick={handlePasswordChange}>
            Update Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;

{/*
function UserProfile() {
  let { currentUser, setCurrentUser } = useContext(userLoginContext);
  const [showModal, setShowModal] = useState(false);
  const [codeData, setCodeData] = useState({
    name: "",
    link: "",
    language: "C++",
    code: "",
  });
  useEffect(() => {
    async function fetchUserCodes() {
      try {
        let usernameOrUID = currentUser?.username || currentUser?.uid;
        if (!usernameOrUID) return;
        let response = await fetch(`https://deployment-test-gilt.vercel.app/users/${usernameOrUID}`);
        let data = await response.json();
        if (data.payload) {
          setCurrentUser(data.payload);
        }
      } catch (error) {
        console.error("Error fetching user codes:", error);
      }
    }
    if (currentUser) {
      fetchUserCodes();
    }
  }, [currentUser]);
  function handleShowModal() {
    setShowModal(true);
  }
  function handleCloseModal() {
    setShowModal(false);
  }
  function handleChange(e) {
    setCodeData({ ...codeData, [e.target.name]: e.target.value });
  }
  async function handleSubmit() {
    if (!codeData.name || !codeData.code) {
      alert("Please enter all required fields!");
      return;
    }
    const existingCode = currentUser?.codes?.find((c) => c.name === codeData.name);
    if (existingCode) {
      alert("A code snippet with this name already exists!");
      return;
    }
    let updatedUser = {
      ...currentUser,
      codes: [...(currentUser?.codes || []), codeData],
    };
    setCurrentUser(updatedUser);
    try {
      await fetch("https://deployment-test-gilt.vercel.app/users/update-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, codes: updatedUser.codes }),
      });
      alert("Code added successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
    }
    handleCloseModal();
  }
  async function handleDeleteCode(codeName) {
    let updatedCodes = currentUser.codes.filter((code) => code.name !== codeName);

    let updatedUser = { ...currentUser, codes: updatedCodes };
    setCurrentUser(updatedUser);

    try {
      await fetch("https://deployment-test-gilt.vercel.app/users/update-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, codes: updatedCodes }),
      });
      alert("Code deleted successfully!");
    } catch (error) {
      console.error("Error deleting code:", error);
    }
  }
  async function handleUpdateCode(codeName, newCode) {
    let updatedCodes = currentUser.codes.map((code) =>
      code.name === codeName ? { ...code, code: newCode } : code
    );
    let updatedUser = { ...currentUser, codes: updatedCodes };
    setCurrentUser(updatedUser);
    try {
      await fetch("https://deployment-test-gilt.vercel.app/users/update-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username, codes: updatedCodes }),
      });
      alert("Code updated successfully!");
    } catch (error) {
      console.error("Error updating code:", error);
    }
  }
  return (
    <div>
      <div className="text-end p-3">
        <p className="fs-3" style={{ color: "#3D8D7A"}}>
          {currentUser?.username || currentUser?.displayName || "Guest User"}
          <CiEdit className="text-warning fs-2 mx-2" />
        </p>
      </div>
      <div className='new-code-option'>
        <button className="btn-new " onClick={handleShowModal}>
          <AiFillFileAdd className="fs-4" /> New Code
        </button>
      </div>
      <div className="code-list mt-4">
        {currentUser?.codes?.length > 0 ? (
          currentUser.codes.map((code, index) => <CodeCard key={index} codeSnippet={code} onDelete={handleDeleteCode} onUpdate={handleUpdateCode}/>)
        ) : (
          <p className="text-center text-muted mt-3">
            Click on <b>New Code</b> to dump your first code.
          </p>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Code Name</Form.Label>
              <Form.Control type="text" name="name" value={codeData.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reference Link (Optional)</Form.Label>
              <Form.Control type="text" name="link" value={codeData.link} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Language</Form.Label>
              <Form.Select name="language" value={codeData.language} onChange={handleChange}>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control as="textarea" rows={5} name="code" value={codeData.code} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" className="btn" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserProfile;
*/}