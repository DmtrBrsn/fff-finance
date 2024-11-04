import { exportCategories } from "@entities/categories";
import { Button } from "@shared/react-aria";
import { Spinner } from "@shared/spinner";
import { DownloadIcon } from "@shared/svg";
import { saveFile } from "@shared/utils";
import { useState } from "react"
import { toast } from "@app/toaster"

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
    <Button onPress={saveCats}>{inProgress ? <Spinner/> : <DownloadIcon/>} Export Categories</Button>
  )
}
