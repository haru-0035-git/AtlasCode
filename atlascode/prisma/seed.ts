import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const course1 = await prisma.course.upsert({
    where: { title: 'JavaScript入門' },
    update: {},
    create: {
      title: 'JavaScript入門',
      description: 'JavaScriptの基本的な文法から、非同期処理までを学びます。',
      language: 'JavaScript',
    },
  });

  const course2 = await prisma.course.upsert({
    where: { title: 'Python基礎' },
    update: {},
    create: {
      title: 'Python基礎',
      description: 'Pythonのデータ型、制御構文、関数など、基本的なプログラミングの概念を学びます。',
      language: 'Python',
    },
  });

  const course3 = await prisma.course.upsert({
    where: { title: 'TailwindCSS実践' },
    update: {},
    create: {
        title: 'TailwindCSS実践',
        description: 'ユーティリティファーストなCSSフレームワークであるTailwindCSSの使い方を実践的に学びます。',
        language: 'CSS',
    }
  });

  await prisma.exercise.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.quiz.deleteMany({}); // Add this line to clear existing quizzes

  const lessons = [
    // JavaScript Lessons
    { course_id: course1.id, title: 'イントロダクション', content: 'このコースへようこそ！', order_index: 1 },
    { course_id: course1.id, title: '変数とデータ型', content: 'let, const, 文字列, 数値について学びます。', order_index: 2 },
    { course_id: course1.id, title: '関数とスコープ', content: '関数の定義方法と変数の有効範囲について学びます。', order_index: 3 },
    // Python Lessons
    { course_id: course2.id, title: 'Pythonの紹介', content: 'Pythonとは何か、何ができるのかを見ていきましょう。', order_index: 1 },
    { course_id: course2.id, title: '基本的なデータ型', content: '整数、浮動小数点数、文字列、ブール値について学びます。', order_index: 2 },
  ];

  for (const lessonData of lessons) {
    await prisma.lesson.upsert({
      where: { course_id_title: { course_id: lessonData.course_id, title: lessonData.title } },
      update: { content: lessonData.content, order_index: lessonData.order_index },
      create: lessonData,
    });
  }

  const lesson2 = await prisma.lesson.findFirst({ where: { title: '変数とデータ型' } });
  if (lesson2) {
    await prisma.exercise.upsert({
      where: { lesson_id_question: { lesson_id: lesson2.id, question: '変数を宣言して、コンソールに出力してみましょう。' } },
      update: { starter_code: '// この下にコードを書いてください\n' },
      create: {
        lesson_id: lesson2.id,
        question: '変数を宣言して、コンソールに出力してみましょう。',
        starter_code: '// この下にコードを書いてください\n',
      },
    });

    // Add a quiz to Lesson 2
    const quiz1 = await prisma.quiz.upsert({
      where: { lesson_id_title: { lesson_id: lesson2.id, title: '変数とデータ型クイズ' } },
      update: {},
      create: {
        lesson_id: lesson2.id,
        title: '変数とデータ型クイズ',
        description: 'JavaScriptの変数とデータ型に関する理解度を測ります。',
        questions: {
          create: [
            {
              text: 'JavaScriptで変数を宣言するために使用されるキーワードはどれですか？',
              type: 'multiple_choice',
              options: ['var', 'let', 'const', 'すべて'],
              answer: ['すべて'],
            },
            {
              text: '次のうち、プリミティブ型ではないものはどれですか？',
              type: 'multiple_choice',
              options: ['string', 'number', 'boolean', 'object'],
              answer: ['object'],
            },
            {
              text: 'JavaScriptで文字列を宣言する際に使用する記号は？',
              type: 'multiple_choice',
              options: ['シングルクォート (\'\')', 'ダブルクォート ("")', 'バッククォート (``)', 'すべて'],
              answer: ['すべて'],
            },
          ],
        },
      },
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
