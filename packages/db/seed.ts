export const normalizeSection = (section: string | null | undefined): string => section ?? "";

type NecRefInput = {
  code: string;
  section: string | null;
  title: string;
};

type NecRefRecord = {
  id: string;
  code: string;
  section: string;
  title: string;
};

type NecRefClient = {
  upsert(args: {
    where: { code_section: { code: string; section: string } };
    update: { title: string };
    create: { code: string; section: string; title: string };
  }): Promise<NecRefRecord>;
};

export async function upsertNecRef(necRef: NecRefInput, necRefs: NecRefClient): Promise<NecRefRecord> {
  const section = normalizeSection(necRef.section);

  return necRefs.upsert({
    where: {
      code_section: {
        code: necRef.code,
        section,
      },
    },
    update: { title: necRef.title },
    create: {
      code: necRef.code,
      section,
      title: necRef.title,
    },
  });
}
