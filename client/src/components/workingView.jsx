import { useState, useEffect } from "react";
import FileIcon from "../FileIcon";
import { createFile } from "../fileCreator";
import { decodeJwt } from "../utils/jwtDecoder";
import { FaFileExcel } from "react-icons/fa";
const WorkingsView = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jsonData, setJsonData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [displayColumnWise, setDisplayColumnWise] = useState(false);
  const [downloadData, setDownloadData] = useState([]);
  const [downloadMode, setDownloadMode] = useState("");
  const [fileType, setFileType] = useState(""); // "xlsx", "csv"
  const [downloadFormat, setDownloadFormat] = useState("xlsx"); // "xlsx" or "csv"
  const [daysCount, setDaysCount] = useState([]);
  const [workings, setWorkings] = useState([]);
  const [period, setPeriod] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [user, setUser] = useState({});
  const [bdata,setBdata] =useState( [
    ["", "kurum"],
    ["", "aylık çalışma"],
    ["Birimadı", "destek hizmetleri başkanlıgı"],
    ["dönem", "kastamonu 2025"],
    [
      "Sıra No",
      "T.C. Kimlik No",
      "Adı Soyadı",
      "Branş",
      "İşçinin Aylık Çalışma Süresi",
      "İşçinin Fiili Çalışma Süresi",
      "Fazla Mesai",
      "Gece Çalışması",
      "Bayram",
      "Ödemeye Esas Fazla Mesai",
    ],
    [
      "Not:Her ayın 2.iş günü mesai bitimine kadar DYS'den gönderilmesi gerekmektedir. İşçi 1 Saat Dinlenme süreleri düşülmüştür",
    ],
    [],
    [
      "Yıllık İzin :İ         Rapor: R         Sevk:S              İdari İzin: İ.İ",
    ],
  ]);
  useEffect(() => {
    // fetchWorkingData();
    handleFileUpload();
    fetchPeriod();
   
   fetchUserInfo();
  }, []);
  const fetchWorkingData = async () => {
    const { id } = decodeJwt(localStorage.getItem("accessToken"));
    console.log("selected period is ", selectedPeriod);
    const result = await fetch(
      `${process.env.REACT_APP_WORKINGSBYPERIOD_API_URL}/${selectedPeriod}/${id}`
    ).then((res) => res.json());
    if (result) {
      setWorkings(result.working);
      setDaysCount(result.days);
      console.log(result);
    }
  };
  const fetchPeriod = async () => {
    const periods = await fetch(process.env.REACT_APP_FETCH_PERIOD_URL).then(
      (res) => res.json()
    );

    setPeriod(periods.result);
    console.log("periodsa are", periods);
  };
  const handlePeriodChang = (period) => {
    setSelectedPeriod(period);
  };
  const handleFileUpload = (event) => {
    //const file = event.target.files[0];
    const file = createFile();
    console.log("file is ", file);
    setSelectedFile(file);
    setJsonData([]);
    setDownloadData([]);
    setDownloadMode("");

    // Determine the file type
    const fileType = getFileType(file);

    setFileType(fileType);

    if (fileType === "xlsx") {
      convertExcelToJSON(file);
    } else if (fileType === "csv") {
      convertCSVToJSON(file);
    } else {
      convertExcelToJSON(file);
    }
  };

  const fetchUserInfo = async () => {
    const { id } = decodeJwt(localStorage.getItem("accessToken"));
    const result = await fetch(`${process.env.REACT_APP_ADMIN_ADD}/${id}`).then(
      (res) => res.json()
    );
    setUser(result.user);
    bdata[0][1]=result.user.location.name;
    bdata[2][1]=result.user.branch
  };
  const getFileType = (file) => {
    const fileName = file.name;
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "xlsx") {
      return "xlsx";
    } else if (extension === "csv") {
      return "csv";
    }
    return ""; // Unsupported file type
  };

  const convertExcelToJSON = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = event.target.result;
      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setJsonData(json);
        setErrorMessage(null);
        console.log("json data is", json);
      } catch (error) {
        setErrorMessage("Invalid or damaged file. Please upload a valid file.");
        setJsonData([]);
        setDownloadData([]);
        setDownloadMode("");
      }
    };

    fileReader.readAsBinaryString(file);
  };

  const convertCSVToJSON = (file) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const csvData = event.target.result;

      Papa.parse(csvData, {
        complete: function (results) {
          // `results.data` contains the parsed CSV data as an array
          setJsonData(json);
          setErrorMessage(null);
        },
        error: function (error) {
          console.error("Error parsing CSV:", error.message);
          setErrorMessage("Error parsing CSV. Please check the file format.");
          setJsonData([]);
          setDownloadData([]);
          setDownloadMode("");
        },
      });
    };
    console.log("json data is", jsonData);
    fileReader.readAsText(file);
  };

  const prepareDownloadData = () => {
    const dataToDownload = displayColumnWise
      ? jsonData
      : transposeData(jsonData);
    setDownloadData(dataToDownload);
    setDownloadMode(displayColumnWise ? "column-wise" : "row-wise");
  };

  const transposeData = (data) => {
    return data[0].map((_, colIndex) => data.map((row) => row[colIndex]));
  };

  const downloadDatas = () => {
    if (downloadFormat === "xlsx") {
      const worksheet = XLSX.utils.aoa_to_sheet(downloadData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelData = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64",
      });

      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${excelData}`;
      link.download = `data_${downloadMode}.xlsx`;
      link.click();
    } else if (downloadFormat === "csv") {
      const csvData = downloadData
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const csvURL = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = csvURL;
      link.download = `data_${downloadMode}.csv`;
      link.click();
      URL.revokeObjectURL(csvURL);
    }
  };

  // if (jsonData.length === 0) {
  //   const rows = [];
  //   for (let i = 0; i < 5; i++) {
  //     const row = [];
  //     for (let j = 0; j < 3; j++) {
  //       row.push(`Random Data ${i + 1}-${j + 1}`);
  //     }
  //     rows.push(row);
  //   }
  //   setJsonData(rows);
  // }

  return (
    <div className="App">
      <div className="container">
        {/* <h1>File to Table</h1> */}

        {/* <div className="download-selectFile">
          <label htmlFor="file-upload" className="file-select-button">
            <input
              type="file"
              id="file-upload"
              accept=".xls,.xlsx,.csv"
              onChange={handleFileUpload}
            />
            <span className="file-icon">
              <FileIcon />
            </span>
            <span className="file-text">
              {selectedFile ? selectedFile.name : "Select a file"}
            </span>
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
        <div className="display-options">
          <label>
            <input
              type="checkbox"
              checked={displayColumnWise}
              onChange={() => setDisplayColumnWise(!displayColumnWise)}
            />
            Display Column-Wise
          </label>
        </div> */}
        <div className="input-group">
          <label htmlFor="donem">Dönem Seçiniz</label>
          <select
            id="donem"
            className="month-dropdown"
            onChange={(e) => handlePeriodChang(e.target.value)}
          >
            <option>Seçiniz ..</option>
            {period &&
              period.map((period, index) => (
                <option key={index} value={period._id}>
                  {period.month + 1} - {period.year}
                </option>
              ))}
          </select>
          <button id="sec" className="btn" onClick={fetchWorkingData}>
            Listele
          </button>
        </div>

        <button
          className="btn btn-right"
          onClick={() => {
            const table = document.querySelector(".json-table");
            const ws = XLSX.utils.table_to_sheet(table);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Puantaj");
            XLSX.writeFile(wb, `puantaj_${selectedPeriod}.xlsx`);
          }}
        >
          <FaFileExcel />
          Excel'e Aktar
        </button>
        {jsonData.length > 0 && (
          <div className="json-table-container">
            <table className="json-table">
              <thead>
                {/* <tr>
                  <th></th>
                  {displayColumnWise
                    ? jsonData.map((_, rowIndex) => (
                        <th key={rowIndex}>Row {rowIndex + 1}</th>
                      ))
                    : jsonData[0].map((_, colIndex) => (
                        <th key={colIndex}>Column {colIndex + 1}</th>
                      ))}
                </tr> */}
                {/* <tr>
                  <th></th>
                  <th style={{ width: "%100" }}>ÇANKIRI İL SAĞLIK MÜDÜRLÜĞÜ</th>
                </tr>
                <tr>
                  <th></th>
                  <th>İŞÇİ AYLIK ÇALIŞMA PUANTAJI</th>
                </tr>
                <tr>
                  <th>Birim adı</th>
                  <th>Sivil savuma birimi-güvenlik personeli</th>
                </tr>
                <tr>
                  <th>Dönem</th>
                  <th>2025 ocak</th>
                </tr> */}
              </thead>
              <tbody>
                {displayColumnWise
                  ? jsonData[0].map((_, colIndex) => (
                      <tr key={colIndex}>
                        <th>{`Column ${colIndex + 1}`}</th>
                        {jsonData.map((row, rowIndex) => (
                          <td key={rowIndex}>{row[colIndex]}</td>
                        ))}
                      </tr>
                    ))
                  : bdata.map((row, rowIndex) =>
                      rowIndex == 5 ? (
                        <>
                          {workings.map((working, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {working.user && working.user.identityNumber}
                              </td>
                              <td>
                                {working.user && working.user.name}{" "}
                                {working.user && working.user.surname}
                              </td>
                              <td>{working.branch && working.branch}</td>
                              {working.dayHour.map((wrk) => (
                                <td>
                                  {wrk.sabah != 0 ? wrk.sabah : wrk.aksam}
                                </td>
                              ))}
                              <td>{working.activeWorkingTime}</td>
                              <td>{working.fiili}</td>
                              <td>
                                {working.fiili > working.activeWorkingTime
                                  ? working.fiili - working.activeWorkingTime
                                  : 0}
                              </td>
                              <td>{working.aksam}</td>
                              <td></td>
                              <td></td>
                              {
                                // whole.map((d)=>(
                                //   <td>{data[index].tcno}</td>
                                // ))
                              }
                            </tr>
                          ))}
                        </>
                      ) : (
                        <>
                          <tr key={rowIndex}>
                            {row.map((value, colIndex) =>
                              value != "Branş" ? (
                                <td key={colIndex}>{value}</td>
                              ) : (
                                <>
                                  <td key={colIndex}>Branş</td>
                                  {daysCount.map((day, index) => (
                                    <td key={index}>{day}</td>
                                  ))}
                                </>
                              )
                            )}
                          </tr>
                        </>
                      )
                    )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default WorkingsView;
