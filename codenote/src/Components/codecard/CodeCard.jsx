import React, { useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import "./CodeCard.css";

function CodeCard({ codeSnippet, onDelete, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [updatedCode, setUpdatedCode] = useState(codeSnippet.code);

  function handleDelete() {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${codeSnippet.name}"?`);
    if (confirmDelete) {
      onDelete(codeSnippet.name);
    }
  }

  function handleUpdate() {
    setShowModal(true);
  }

  function handleSubmit() {
    if (!updatedCode.trim()) {
      alert("Code cannot be empty!");
      return;
    }
    onUpdate(codeSnippet.name, updatedCode);
    setShowModal(false);
  }

  return (
    <>
      <Card className="code-card mb-3 shadow-sm">
        <Card.Body>
          <Card.Title className="d-flex justify-content-between align-items-center ">
            {codeSnippet.link ? (
              <a href={codeSnippet.link} target="_blank" rel="noopener noreferrer" className="card-title-link">
                {codeSnippet.name}
              </a>
            ) : (
              <span>{codeSnippet.name}</span>
            )}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{codeSnippet.language}</Card.Subtitle>
          <pre className="p-2 border rounded bg-light" style={{ maxHeight: "200px", overflow: "auto" }}>
            {codeSnippet.code}
          </pre>
          <div className="change-btn">
            <Button onClick={handleDelete} className="delete-button"><MdDelete size={24} /></Button>
            <Button onClick={handleUpdate} className="update-button"><FaEdit size={24} /></Button>
          </div>
        </Card.Body>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>Update Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Code</Form.Label>
              <Form.Control as="textarea" rows={5} value={updatedCode} onChange={(e) => setUpdatedCode(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="login-btn" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" className="login-btn" onClick={handleSubmit}>Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default CodeCard;
