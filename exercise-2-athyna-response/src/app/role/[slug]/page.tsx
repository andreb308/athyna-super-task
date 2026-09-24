import type { Metadata } from "next"
import { getJobById } from "@/domain/jobs"
import { JobDetailsClient } from "@/components/job-details"

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const result = await getJobById(slug)
    const job = result.job
    return {
      title: `${job.title} at ${job.company.name} | Athyna`,
      description:
        job.overview ||
        `${job.title} position at ${job.company.name}. Experience: ${job.seniority}, Type: ${job.employmentType}.`,
    }
  } catch {
    return {
      title: "Job Details | Athyna",
      description: "Explore AI and tech career opportunities with Athyna.",
    }
  }
}

export default async function RoleSlugPage({ params }: PageProps) {
  const { slug } = await params

  let initialJob = null
  try {
    const result = await getJobById(slug)
    initialJob = result.job
  } catch {
    // Handled gracefully in client view
  }

  return <JobDetailsClient id={slug} initialJob={initialJob} />
}
