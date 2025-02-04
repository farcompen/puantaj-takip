import { useState } from "react";

const PuantajRedModal = (props) => {
  cosnt[(rejectSummary, setRejectSummary)] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const rejectPuantaj = async () => {
    console.log("aa");
  };
  return (
    <>
      <div
        className="modal-overlay"
        style={{ display: isModalOpen ? "flex" : "none" }}
      >
        <div className="modal">
          <div className="modal-header">
            <h3>Red Gerekçe Ekranı</h3>
          </div>
          <div className="modal-content">
            <div className="input-group">
              <textarea
                name="rejectSummary"
                value={rejectSummary}
                placeholder="lütgen red gerekçesini giriniz ..."
                onChange={(e) => setRejectSummary(e.target.value)}
              ></textarea>
              <button onClick={rejectPuantaj}>Kaydet</button>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={() => handleApprove()}>
              Onayla <FaCheckCircle />
            </button>
            <button
              className="btn btn-red"
              onClick={() => handleModalState(false)}
            >
              Reddet <FaWindowClose />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default PuantajRedModal;
