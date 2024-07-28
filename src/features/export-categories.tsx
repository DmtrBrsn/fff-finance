import { exportCategories } from "@entities/categories";
import { Spinner } from "@shared/spinner";
import { DownloadIcon } from "@shared/svg";
import { saveFile } from "@shared/utils";
import { useState } from "react"
import { toast } from "react-toastify";

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
