export const epdsQuestions = {
  type: "EPDS",
  instruction:"This questionnaire asks about how you have been feeling over the past 7 days — not just today. There are 10 questions. For each one, please tick the answer that comes closest to how you have felt.\n\nAnswer all questions in order and do not go back to change answers.\n\nThere are no right or wrong answers. This is not a test.",
  questions: [
    {
      question: "I have been able to laugh and see the funny side of things",
      options: [
        { Label: "As much as I always could", value: 0 },
        { Label: "Not quite so much now", value: 1 },
        { Label: "Definitely not so much now", value: 2 },
        { Label: "Not at all", value: 3 },
      ],
    },
    {
      question: "I have looked forward with enjoyment to things",
      options: [
        { Label: "As much as I ever did", value: 0 },
        { Label: "Rather less than I used to", value: 1 },
        { Label: "Definitely less than I used to", value: 2 },
        { Label: "Hardly at all", value: 3 },
      ],
    },
    {
      question: "I have blamed myself unnecessarily when things went wrong",
      options: [
        { Label: "No, never", value: 0 },
        { Label: "Not very often", value: 1 },
        { Label: "Yes, some of the time", value: 2 },
        { Label: "Yes, most of the time", value: 3 },
      ],
    },
    {
      question: "I have been anxious or worried for no good reason",
      options: [
        { Label: "No, not at all", value: 0 },
        { Label: "Hardly ever", value: 1 },
        { Label: "Yes, sometimes", value: 2 },
        { Label: "Yes, very often", value: 3 },
      ],
    },
    {
      question: "I have felt scared or panicky for no very good reason",
      options: [
        { Label: "No, not at all", value: 0 },
        { Label: "No, not much", value: 1 },
        { Label: "Yes, sometimes", value: 2 },
        { Label: "Yes, quite a lot", value: 3 },
      ],
    },
    {
      question: "Things have been getting on top of me",
      options: [
        { Label: "No, I have been coping as well as ever", value: 0 },
        { Label: "No, most of the time I have coped quite well", value: 1 },
        { Label: "Yes, sometimes I haven’t been coping as well as usual", value: 2 },
        { Label: "Yes, most of the time I haven’t been able to cope", value: 3 },
      ],
    },
    {
      question: "I have been so unhappy that I have had difficulty sleeping",
      options: [
        { Label: "No, not at all", value: 0 },
        { Label: "Not very often", value: 1 },
        { Label: "Yes, sometimes", value: 2 },
        { Label: "Yes, most of the time", value: 3 },
      ],
    },
    {
      question: "I have felt sad or miserable",
      options: [
        { Label: "No, not at all", value: 0 },
        { Label: "Not very often", value: 1 },
        { Label: "Yes, quite often", value: 2 },
        { Label: "Yes, most of the time", value: 3 },
      ],
    },
    {
      question: "I have been so unhappy that I have been crying",
      options: [
        { Label: "No, never", value: 0 },
        { Label: "Only occasionally", value: 1 },
        { Label: "Yes, quite often", value: 2 },
        { Label: "Yes, most of the time", value: 3 },
      ],
    },
    {
      question: "The thought of harming myself has occurred to me",
      options: [
        { Label: "Never", value: 0 },
        { Label: "Hardly ever", value: 1 },
        { Label: "Sometimes", value: 2 },
        { Label: "Yes, quite often", value: 3 },
      ],
    },
  ],
};

export const urduEpdsQuestions = {
  type: "EPDS",
  instruction: "یہ سوالنامہ پچھلے 7 دنوں کے دوران آپ کے احساسات کے بارے میں ہے — نہ کہ صرف آج کے۔ اس میں 10 سوالات ہیں۔ ہر سوال کے لیے وہ جواب چنیں جو آپ کے احساس کے سب سے قریب ہو۔\n\n تمام سوالات ترتیب سے جواب دیں اور ایک بار دیے گئے جوابات تبدیل نہ کریں۔\n\nکوئی صحیح یا غلط جواب نہیں ہے۔ یہ کوئی امتحان نہیں ہے۔",
  questions: [
    {
      question: "میں ہنسنے اور چیزوں کے مزاحیہ پہلو کو دیکھنے کے قابل رہی ہوں",
      options: [
        { Label: "جتنا میں ہمیشہ کر سکتی تھی", value: 0 },
        { Label: "اب اتنا نہیں", value: 1 },
        { Label: "یقیناً اب بہت کم", value: 2 },
        { Label: "بالکل نہیں", value: 3 },
      ],
    },
    {
      question: "میں نے چیزوں سے لطف اندوز ہونے کے لیے آگے کی طرف دیکھا ہے",
      options: [
        { Label: "جتنا پہلے کرتی تھی", value: 0 },
        { Label: "پہلے سے کچھ کم", value: 1 },
        { Label: "یقیناً پہلے سے کم", value: 2 },
        { Label: "تقریباً بالکل نہیں", value: 3 },
      ],
    },
    {
      question: "جب چیزیں غلط ہوئیں تو میں نے خود کو بلاوجہ الزام دیا",
      options: [
        { Label: "نہیں، کبھی نہیں", value: 0 },
        { Label: "زیادہ نہیں", value: 1 },
        { Label: "ہاں، کبھی کبھار", value: 2 },
        { Label: "ہاں، زیادہ تر وقت", value: 3 },
      ],
    },
    {
      question: "میں بغیر کسی خاص وجہ کے بے چین یا فکرمند رہی ہوں",
      options: [
        { Label: "نہیں، بالکل نہیں", value: 0 },
        { Label: "شاذ و نادر", value: 1 },
        { Label: "ہاں، کبھی کبھار", value: 2 },
        { Label: "ہاں، بہت زیادہ", value: 3 },
      ],
    },
    {
      question: "میں بغیر کسی خاص وجہ کے خوفزدہ یا گھبرائی ہوئی محسوس کرتی رہی ہوں",
      options: [
        { Label: "نہیں، بالکل نہیں", value: 0 },
        { Label: "نہیں، زیادہ نہیں", value: 1 },
        { Label: "ہاں، کبھی کبھار", value: 2 },
        { Label: "ہاں، کافی زیادہ", value: 3 },
      ],
    },
    {
      question: "چیزیں مجھ پر حاوی ہوتی جا رہی ہیں",
      options: [
        { Label: "نہیں، میں پہلے کی طرح نمٹ رہی ہوں", value: 0 },
        { Label: "نہیں، زیادہ تر وقت میں ٹھیک رہی ہوں", value: 1 },
        { Label: "ہاں، کبھی کبھار میں ٹھیک طرح سے نہیں نمٹ سکی", value: 2 },
        { Label: "ہاں، زیادہ تر وقت میں نمٹ نہیں سکی", value: 3 },
      ],
    },
    {
      question: "میں اتنی ناخوش رہی ہوں کہ مجھے سونے میں مشکل ہوئی",
      options: [
        { Label: "نہیں، بالکل نہیں", value: 0 },
        { Label: "زیادہ نہیں", value: 1 },
        { Label: "ہاں، کبھی کبھار", value: 2 },
        { Label: "ہاں، زیادہ تر وقت", value: 3 },
      ],
    },
    {
      question: "میں اداس یا مایوس رہی ہوں",
      options: [
        { Label: "نہیں، بالکل نہیں", value: 0 },
        { Label: "زیادہ نہیں", value: 1 },
        { Label: "ہاں، کافی دفعہ", value: 2 },
        { Label: "ہاں، زیادہ تر وقت", value: 3 },
      ],
    },
    {
      question: "میں اتنی ناخوش رہی ہوں کہ میں رو پڑی",
      options: [
        { Label: "نہیں، کبھی نہیں", value: 0 },
        { Label: "کبھی کبھار", value: 1 },
        { Label: "ہاں، کافی دفعہ", value: 2 },
        { Label: "ہاں، زیادہ تر وقت", value: 3 },
      ],
    },
    {
      question: "مجھے خود کو نقصان پہنچانے کا خیال آیا",
      options: [
        { Label: "کبھی نہیں", value: 0 },
        { Label: "شاذ و نادر", value: 1 },
        { Label: "کبھی کبھار", value: 2 },
        { Label: "ہاں، کافی دفعہ", value: 3 },
      ],
    },
  ],
};

