import { normalizeLatin, stripVowels } from '../normalizeLatin';

describe('normalizeLatin', () => {
  describe('basic normalization', () => {
    it('should lowercase text', () => {
      expect(normalizeLatin('BISMILLAH')).toBe('bismillah');
    });

    it('should remove diacritics/accents', () => {
      expect(normalizeLatin('kâfirûn')).toBe('kafirun');
      expect(normalizeLatin('Allāh')).toBe('allah');
    });

    it('should remove spaces and punctuation', () => {
      expect(normalizeLatin('al-hamdulillah')).toBe('alhamdulillah');
      expect(normalizeLatin("qul yâ ayyuhal-kâfirûn")).toContain('kulyayuhalkafirun');
    });
  });

  describe('Indonesian phonetic mappings', () => {
    it('should map q to k', () => {
      expect(normalizeLatin('qul')).toBe('kul');
      expect(normalizeLatin('quran')).toBe('kuran');
    });

    it('should map sy to sh', () => {
      expect(normalizeLatin('syukur')).toBe('shukur');
    });

    it('should map dz to z', () => {
      expect(normalizeLatin('dzikir')).toBe('zikir');
    });

    it('should map ts to s', () => {
      expect(normalizeLatin('tsabit')).toBe('sabit');
    });
  });

  describe('double vowel compression', () => {
    it('should compress aa to a', () => {
      expect(normalizeLatin('kaafir')).toBe('kafir');
    });

    it('should compress ii to i', () => {
      expect(normalizeLatin('kariim')).toBe('karim');
    });

    it('should compress uu to u', () => {
      expect(normalizeLatin('ruuh')).toBe('ruh');
    });
  });

  describe('complex examples', () => {
    it('should normalize full verse transliteration', () => {
      const result = normalizeLatin("qul yâ ayyuhal-kâfirûn");
      // After q→k, removing diacritics, spaces, hyphens, and compressing vowels
      expect(result).toBe('kulyayuhalkafirun');
    });

    it('should handle mixed case and diacritics', () => {
      expect(normalizeLatin('Bismillāhir-Rahmānir-Rahīm')).toBe('bismillahirrahmanirrahim');
    });
  });
});

describe('stripVowels', () => {
  it('should remove all vowels', () => {
    expect(stripVowels('kafirun')).toBe('kfrn');
    expect(stripVowels('bismillah')).toBe('bsmllh');
  });

  it('should handle empty string', () => {
    expect(stripVowels('')).toBe('');
  });

  it('should handle consonant-only string', () => {
    expect(stripVowels('bcd')).toBe('bcd');
  });
});

describe('skeleton matching for fuzzy search', () => {
  it('should produce same skeleton for variant spellings', () => {
    // kafirun vs kaafrun should have same skeleton
    const skeleton1 = stripVowels(normalizeLatin('kafirun'));
    const skeleton2 = stripVowels(normalizeLatin('kaafrun'));
    expect(skeleton1).toBe('kfrn');
    expect(skeleton2).toBe('kfrn');
    expect(skeleton1).toBe(skeleton2);
  });

  it('should match qul and kul via q→k mapping', () => {
    const skeleton1 = stripVowels(normalizeLatin('qul'));
    const skeleton2 = stripVowels(normalizeLatin('kul'));
    expect(skeleton1).toBe(skeleton2);
  });

  it('should help match kulyaayuhalkafirun to verse 109:1', () => {
    // User types "kulyaayuhalkafirun" (with k instead of q, extra a)
    // Verse has "qul yâ ayyuhal-kâfirûn"
    const userQuery = normalizeLatin('kulyaayuhalkafirun');
    const verseNorm = normalizeLatin("qul yâ ayyuhal-kâfirûn");

    // Via skeleton, they should match
    const userSkeleton = stripVowels(userQuery);
    const verseSkeleton = stripVowels(verseNorm);

    expect(verseSkeleton).toContain(userSkeleton);
  });
});
