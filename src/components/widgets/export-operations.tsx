import { useState } from "react"
import { exportOperations } from "../../db/import-export/export";
import { toast } from "react-toastify";
import { Spinner } from "../common/spinner";
import { DownloadIcon } from "../common/svg";
import { saveFile } from "../../utils/file-utils";

export const ExportOperations = () => {
  const [inProgress, setInProgress] = useState(false)
  
  const saveOps = async () => {
    setInProgress(true)
    try {
      const {blob, name} = await exportOperations()
      saveFile(blob, name)
    }
    catch(err) {
      toast.error(`${err}`)
      console.log(err)
    }
    setInProgress(false)
  }

  return (
    <div className='settings-section-container settings-section-container-center'>
      <label>Export Operations</label>
      <button className="btn-icon" onClick={saveOps}>
        {inProgress ? <Spinner/> : <DownloadIcon/>}
      </button>
    </div>
  )
}


