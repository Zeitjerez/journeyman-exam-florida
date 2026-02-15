import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blueprintCategories = [
  ['BC01', 'Wiring Methods & Materials'],
  ['BC02', 'Wiring & Protection'],
  ['BC03', 'General Electrical Theory & Principles'],
  ['BC04', 'Equipment for General Use'],
  ['BC05', 'Plan Reading'],
  ['BC06', 'Communication Systems'],
  ['BC07', 'Motors & Controls'],
  ['BC08', 'Special Conditions'],
  ['BC09', 'Special Equipment'],
  ['BC10', 'Special Occupancies'],
] as const;

const necRefs = [
  ['90', null, 'Introduction and scope'],
  ['100', null, 'Definitions'],
  ['110', null, 'Requirements for electrical installations'],
  ['200', null, 'Use and identification of grounded conductors'],
  ['210', null, 'Branch circuits'],
  ['215', null, 'Feeders'],
  ['220', null, 'Load calculations'],
  ['225', null, 'Outside branch circuits and feeders'],
  ['230', null, 'Services'],
  ['240', null, 'Overcurrent protection'],
  ['250', null, 'Grounding and bonding'],
  ['300', null, 'Wiring methods'],
  ['310', null, 'Conductors for general wiring'],
  ['312', null, 'Cabinets and enclosures'],
  ['314', null, 'Outlet and junction boxes'],
  ['320', null, 'Armored cable'],
  ['330', null, 'Metal-clad cable'],
  ['334', null, 'Nonmetallic-sheathed cable'],
  ['342', null, 'Intermediate metal conduit'],
  ['344', null, 'Rigid metal conduit'],
  ['352', null, 'Rigid PVC conduit'],
  ['358', null, 'Electrical metallic tubing'],
  ['400', null, 'Flexible cords and cables'],
  ['404', null, 'Switches'],
  ['406', null, 'Receptacles and attachment plugs'],
  ['408', null, 'Switchboards and panelboards'],
  ['410', null, 'Luminaires and lampholders'],
  ['422', null, 'Appliances'],
  ['430', null, 'Motors and controllers'],
  ['440', null, 'Air-conditioning and refrigerating equipment'],
] as const;

async function main() {
  const exam = await prisma.exam.upsert({
    where: { examCode: 'miami_dade_journeyman_2020' },
    update: {},
    create: {
      examCode: 'miami_dade_journeyman_2020',
      name: 'Miami-Dade Journeyman Electrician 2020',
      jurisdiction: 'Miami-Dade',
      licenseTrack: 'Journeyman Electrician',
      examYear: 2020,
      necEdition: 2020,
      openBook: true,
      totalQuestions: 70,
      durationMinutes: 180,
    },
  });

  for (const [code, name] of blueprintCategories) {
    await prisma.blueprintCategory.upsert({
      where: { examId_categoryCode: { examId: exam.id, categoryCode: code } },
      update: { categoryName: name, weightPercentage: null, questionCountTarget: null },
      create: {
        examId: exam.id,
        categoryCode: code,
        categoryName: name,
        weightPercentage: null,
        questionCountTarget: null,
        notes: 'Weight pending official blueprint confirmation.',
      },
    });
  }

  for (const [article, section, titleShort] of necRefs) {
    await prisma.necRef.upsert({
      where: {
        necEdition_article_section_tableId: {
          necEdition: 2020,
          article,
          section,
          tableId: null,
        },
      },
      update: {},
      create: {
        necEdition: 2020,
        article,
        section,
        titleShort,
      },
    });
  }

  await prisma.questionTemplate.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Reference lookup stub',
      questionType: 'multiple_choice',
      promptTemplate: 'Identify the best NEC reference for the scenario.',
      answerFormat: 'single_option',
      difficultyDefault: 'medium',
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
