import { Form } from "@remix-run/react"

import Button from "../Button"
import { usePopoverContext } from "."

export interface PopoverUploadContentProps {}

export default function PopoverUploadContent({}: PopoverUploadContentProps): JSX.Element | null {
  const { closePopover, initialFocusRef } =
    usePopoverContext<HTMLInputElement>()

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      className="flex flex-col gap-2 p-2"
    >
      <input
        id="file_upload"
        type="file"
        name="files"
        multiple
        required
        ref={initialFocusRef}
      />
      <input type="text" name="destination" placeholder="Destination..." />

      <div className="flex items-center justify-end gap-2">
        <Button.Secondary type="button" onClick={closePopover}>
          Cancel
        </Button.Secondary>
        <Button.Primary type="submit" onClick={closePopover}>
          Upload
        </Button.Primary>
      </div>
    </Form>
  )
}
