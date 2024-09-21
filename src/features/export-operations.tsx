import { exportOperations } from "@entities/operations";
import { ButtonIcon } from "@shared/react-aria";
import { Spinner } from "@shared/spinner";
import { DownloadIcon } from "@shared/svg";
import { saveFile } from "@shared/utils";
import { useState } from "react"
import { toast } from "react-toastify";

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
      <ButtonIcon onPress={saveOps}>
        {inProgress ? <Spinner/> : <DownloadIcon/>}
      </ButtonIcon>
    </div>
  )
}


