import type { Metadata } from "next"
import { getJobById } from "@/domain/jobs"
import { JobDetailsClient } from "@/components/job-details"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const result = await getJobById(id)
    const job = result.job
    return {
      title: `${job.title} at ${job.company.name} | Athyna`,
      description:
        job.overview ||
        `${job.title} position at ${job.company.name}. Experience: ${job.seniority}, Type: ${job.employmentType}.`,
      openGraph: {
        title: `${job.title} at ${job.company.name}`,
        description: job.overview || undefined,
      },
    }
  } catch {
    return {
      title: "Job Details | Athyna",
      description: "Explore AI and tech career opportunities with Athyna.",
    }
  }
}

export default async function JobPage({ params }: PageProps) {
  const { id } = await params

  let initialJob = null
  try {
    const result = await getJobById(id)
    initialJob = result.job
  } catch {
    // Handled gracefully in client view
  }

  return <JobDetailsClient id={id} initialJob={initialJob} />
}
