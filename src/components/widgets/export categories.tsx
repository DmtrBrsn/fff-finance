import { useState } from "react"
import { exportCategories } from "../../db/import-export/export";
import { toast } from "react-toastify";
import { Spinner } from "../common/spinner";
import { DownloadIcon } from "../common/svg";
import { saveFile } from "../../utils/file-utils";

export const ExportCategories = () => {
  const [inProgress, setInProgress] = useState(false)
  
  const saveCats = async () => {
    setInProgress(true)
    try {
      const {blob, name} = await exportCategories()
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
      <label>Export Categories</label>
      <button className="btn-icon" onClick={saveCats}>
        {inProgress ? <Spinner/> : <DownloadIcon/>}
      </button>
    </div>
  )
}
