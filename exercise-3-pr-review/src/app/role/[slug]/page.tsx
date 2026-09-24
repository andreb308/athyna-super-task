import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchJobBySlug } from "@/services/jobs";
import { getJobLocationLabel, getJobExperienceLabel } from "@/lib/job-display";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/athyna-ui";
import JobDescription from "./_sections/job-description";
import { BackButton } from "./_components/back-button";

type Params = Promise<{ slug: string }>;

function formatSalary(min?: number | null, max?: number | null): string {
  if (typeof min !== "number" || typeof max !== "number") {
    return "Not specified";
  }

  const fmt = (n: number) => {
    if (n >= 1000) return `$${Math.round(n / 1000)}k`;
    return `$${n}`;
  };
  return `${fmt(min)}-${fmt(max)}`;
}

export default async function RolePage({ params }: { params: Params }) {
  const { slug } = await params;
  const job = await fetchJobBySlug(slug);

  if (!job) notFound();

  const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL ?? "";
  const withJobId = (href: string): string => {
    const url = new URL(href);
    url.searchParams.set("globalJobBoardJobId", job.id);
    return url.toString();
  };
  const isCRM = job.origin === "CRM";
  const applyLink = isCRM
    ? withJobId(platformUrl)
    : (job.applicationUrl ?? withJobId(`${platformUrl}/auth/signup`));

  const experienceLabel = getJobExperienceLabel(job);
  const locationLabel = getJobLocationLabel(job);

  const publishedAtLabel = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date unavailable";

  const jobTypeName = job.type?.name ?? "Not specified";

  return (
    <div className="relative z-10 mx-auto w-full max-w-[860px] px-6 xl:px-0 py-10 md:py-16 flex flex-col gap-8">
      {/* Back */}
      <BackButton />

      {/* Header — centered */}
      <div className="flex flex-col items-center gap-4 text-center">
        <Avatar size="4xl" radius="medium">
          <AvatarImage
            src={job.companyPhotoUrl ?? undefined}
            alt={`${job.companyName ?? "Company"} logo`}
          />
          <AvatarFallback>
            {(job.companyName ?? "C").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-4xl md:text-5xl font-normal leading-[48px] text-foreground">
          {job.name}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-2 text-lg text-dark-purple font-medium">
          <span className="underline">@{job.companyName}</span>
          <span>•</span>
          <span>{locationLabel}</span>
          <span>•</span>
          <span>Published on {publishedAtLabel}</span>
        </div>
      </div>

      {/* Metadata card — 4 columns */}
      <div className="bg-background rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline outline-1 outline-offset-[-1px] outline-stone-900 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-stone-900/10">
        {/* Location */}
        <div className="flex flex-col items-center gap-2 px-8 py-6">
          <Image
            src="/images/icons/location_pin.svg"
            width={32}
            height={32}
            alt=""
          />
          <span className="text-sm font-medium text-foreground/60">
            Location
          </span>
          <span className="text-base font-normal text-foreground text-center block">
            {locationLabel}
          </span>
        </div>

        {/* Employment */}
        <div className="flex flex-col items-center gap-2 px-8 py-6">
          <Image src="/images/icons/clock.svg" width={32} height={32} alt="" />
          <span className="text-sm font-medium text-foreground/60">
            Employment
          </span>
          <span className="text-base font-normal text-foreground">
            {jobTypeName}
          </span>
        </div>

        {/* Experience */}
        <div className="flex flex-col items-center gap-2 px-8 py-6">
          <Image
            src="/images/icons/suitcase.svg"
            width={32}
            height={32}
            alt=""
          />
          <span className="text-sm font-medium text-foreground/60">
            Experience
          </span>
          <span className="text-base font-normal text-foreground">
            {experienceLabel}
          </span>
        </div>

        {/* Salary */}
        <div className="flex flex-col items-center gap-2 px-8 py-6">
          <Image src="/images/icons/money.svg" width={32} height={32} alt="" />
          <span className="text-sm font-medium text-foreground/60">Salary</span>
          <span className="text-base font-normal text-foreground">
            {formatSalary(job.minAnnualSalary, job.maxAnnualSalary)}
          </span>
        </div>
      </div>

      {/* Description */}
      <div>
        <JobDescription
          rawText={job.description ?? "Description not available."}
        />
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          variant="primary"
          className="w-full h-14 rounded-[30px] text-lg font-normal"
        >
          <Link
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full"
          >
            {isCRM ? "Apply with Athyna" : "Apply externally"}
            {!isCRM && (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            )}
          </Link>
        </Button>
        <Button
          variant="secondary"
          className="w-full h-14 rounded-[30px] text-lg font-normal"
        >
          <Link
            href={withJobId(`${platformUrl}/auth/login`)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center"
          >
            Sign in to unlock all jobs
          </Link>
        </Button>
      </div>
    </div>
  );
}
