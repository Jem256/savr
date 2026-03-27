import { useState } from "react";
import { deleteGoal } from "../api";

export default function DeleteGoalModal({ goal, inviteCode, onDeleted, onClose }) {
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const isCollaborative = goal.goal_type === "collaborative";

  async function handleDelete(e) {
    e.preventDefault();
    setError("");

    if (!nameInput.trim()) return setError("Enter your creator name to confirm");

    setDeleting(true);
    try {
      await deleteGoal(goal.id, nameInput.trim(), inviteCode);
      onDeleted();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal delete-modal">
        <div className="modal-header">
          <h2>Delete Goal</h2>
          <button className="modal-close" onClick={onClose}>&#10005;</button>
        </div>

        <div className="delete-warning">
          <span className="delete-warning-icon">&#9888;</span>
          <p>
            This will permanently delete <strong>{goal.name}</strong> and all of
            its contribution history. This cannot be undone.
          </p>
        </div>

        <form onSubmit={handleDelete} className="delete-form">
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="del-name">
              Type your creator name <strong>({goal.creator_name})</strong> to confirm
            </label>
            <input
              id="del-name"
              type="text"
              placeholder={goal.creator_name}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              autoFocus
            />
          </div>

          {isCollaborative && !inviteCode && (
            <p className="delete-note">
              You must enter the invite code on the goal page before deleting a
              collaborative goal.
            </p>
          )}

          <div className="delete-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-danger"
              disabled={deleting || (isCollaborative && !inviteCode)}
            >
              {deleting ? "Deleting..." : "Delete Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
