import { useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"

import { transformMsToReadableString } from "~/packages/helpers/format"
import cache from "~/packages/service/cache.server"
import Table from "~/packages/ui/Table"
import { Caption } from "~/packages/ui/Text"

import { handle } from "../cache"

interface LoaderData {
  max: number
  size: number
  ttl: number
}

export const loader: LoaderFunction = async () => {
  const { size, max, ttl } = cache

  return json<LoaderData>({ size, max, ttl })
}

export default function CacheIndex(): JSX.Element | null {
  const { size, max, ttl } = useLoaderData<LoaderData>()
  const { icon, name } = handle.adminApp

  return (
    <div className="flex-center h-full flex-col gap-4 p-4">
      <div className="[&>*]:scale-[2] m-4">{icon}</div>
      <Caption className="w-full pb-4 text-center">{name}</Caption>

      <Table
        orientation="vertical"
        data={[{ size, max, ttl }]}
        columns={[
          { id: "size", header: "Entries" },
          {
            id: "max",
            header: "Size limit",
            cell: (value) => `${value} entries`,
          },
          {
            id: "ttl",
            header: "Expiry time",
            cell: (value) => <span>{transformMsToReadableString(value)}</span>,
          },
        ]}
        headCellClassName="px-4 py-2 text-secondary text-base text-left"
        bodyCellClassName="px-4 py-2 min-w-[4rem]  text-left"
        bodyRowClassName="border-b border-divider"
      />
    </div>
  )
}
