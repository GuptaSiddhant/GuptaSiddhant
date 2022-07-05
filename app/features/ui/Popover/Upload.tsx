import { Form } from "@remix-run/react"

import { usePopoverContext } from "."

export default function PopoverUploadContent(): JSX.Element | null {
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
        name="filePath"
        multiple={false}
        required
        ref={initialFocusRef}
      />
      <input type="text" name="destination" placeholder="Destination..." />

      <button type="button" onClick={closePopover}>
        Cancel
      </button>
      <button type="submit" onClick={closePopover}>
        Upload
      </button>
    </Form>
  )
}
