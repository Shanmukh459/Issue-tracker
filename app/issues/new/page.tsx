"use client"

import ErrorMessage from "@/app/components/ErrorMessage"
import Spinner from "@/app/components/Spinner"
import { createIssueSchema } from "@/app/validationSchemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Callout, TextField } from "@radix-ui/themes"
import axios from "axios"
import "easymde/dist/easymde.min.css"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import SimpleMDE from "react-simplemde-editor"
import { z } from "zod"

// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
// })

type IssueForm = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  })
  const router = useRouter()
  const [error, setError] = useState("")
  const [isSubmitting, setSubmitting] = useState(false)

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true)
      await axios.post("/api/issues", data)
      router.push("/issues")
    } catch (error) {
      setSubmitting(false)
      console.log(setError("An unexpected error occured!"))
    }
  })

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          Submit New Issue
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  )
}

export default NewIssuePage
