-- CreateEnum
CREATE TYPE "Status" AS ENUM ('completed', 'in_progress');

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "course_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "starter_code" TEXT,
    "expected_output" TEXT,
    "test_cases" JSONB,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "exercise_id" INTEGER NOT NULL,
    "session_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "result" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" SERIAL NOT NULL,
    "session_id" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,
    "lesson_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
