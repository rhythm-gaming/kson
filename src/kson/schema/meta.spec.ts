import { assert } from 'chai';
import { MetaInfo } from './meta.js';

describe('MetaInfo', () => {
    it('should accept a minimal valid MetaInfo object', () => {
        const validData1 = {
            title: 'Song Title',
            artist: 'Artist Name',
            chart_author: 'Charter Name',
            difficulty: 2,
            level: 18,
            disp_bpm: '180',
        };
        assert.deepStrictEqual(MetaInfo.assert(validData1), validData1);

        const validData2 = {
            ...validData1,
            difficulty: 'extended',
        };
        assert.deepStrictEqual(MetaInfo.assert(validData2), validData2);
    });

    it('should accept a full valid MetaInfo object', () => {
        const fullValidData = {
            title:               'Song Title',
            title_translit:      'Song Title Translit',
            title_img_filename:  'title.png',
            artist:              'Artist Name',
            artist_translit:     'Artist Name Translit',
            artist_img_filename: 'artist.png',
            chart_author:        'Charter Name',
            difficulty:          'infinite',
            level:               20,
            disp_bpm:            '120-240',
            std_bpm:             180.0,
            jacket_filename:     'jacket.png',
            jacket_author:       'Jacket Author',
            icon_filename:       'icon.png',
            information:         'Some information.',
        };
        assert.deepStrictEqual(MetaInfo.assert(fullValidData), fullValidData);
    });

    it('should reject objects with missing required fields', () => {
        const minimalValid = {
            title: 'Song Title',
            artist: 'Artist Name',
            chart_author: 'Charter Name',
            difficulty: 2,
            level: 18,
            disp_bpm: '180',
        };

        for (const key of Object.keys(minimalValid)) {
            const invalidData = { ...minimalValid };
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete invalidData[key as keyof typeof invalidData];
            assert.throws(() => MetaInfo.assert(invalidData), null, null, `should throw for missing ${key}`);
        }
    });

    it('should reject objects with fields of incorrect types', () => {
        const base = {
            title: 'Song Title',
            artist: 'Artist Name',
            chart_author: 'Charter Name',
            difficulty: 2,
            level: 18,
            disp_bpm: '180',
        };

        assert.throws(() => MetaInfo.assert({ ...base, title: 123 }), "title");
        assert.throws(() => MetaInfo.assert({ ...base, artist: false }), "artist");
        assert.throws(() => MetaInfo.assert({ ...base, chart_author: null }), "chart_author");
        assert.throws(() => MetaInfo.assert({ ...base, difficulty: {} }), "difficulty");
        assert.throws(() => MetaInfo.assert({ ...base, level: "18" }), "level");
        assert.throws(() => MetaInfo.assert({ ...base, disp_bpm: 180 }), "disp_bpm");
        assert.throws(() => MetaInfo.assert({ ...base, std_bpm: "180" }), "std_bpm");
        assert.throws(() => MetaInfo.assert({ ...base, jacket_filename: 123 }), "jacket_filename");
    });
    
    it('should reject if level is not a Uint', () => {
        const base = {
            title: 'Song Title',
            artist: 'Artist Name',
            chart_author: 'Charter Name',
            difficulty: 2,
            level: 18,
            disp_bpm: '180',
        };

        assert.throws(() => MetaInfo.assert({ ...base, level: -1 }), "level");
        assert.throws(() => MetaInfo.assert({ ...base, level: 18.5 }), "level");
    });
    
    it('should reject if std_bpm is not a Double', () => {
        const base = {
            title: 'Song Title',
            artist: 'Artist Name',
            chart_author: 'Charter Name',
            difficulty: 2,
            level: 18,
            disp_bpm: '180',
        };
        assert.throws(() => MetaInfo.assert({ ...base, std_bpm: Number.POSITIVE_INFINITY }), "std_bpm");
        assert.throws(() => MetaInfo.assert({ ...base, std_bpm: Number.NaN }), "std_bpm");
    });
    
    it('should reject non-record values', () => {
        assert.throws(() => MetaInfo.assert(null));
        assert.throws(() => MetaInfo.assert(undefined));
        assert.throws(() => MetaInfo.assert("hello"));
        assert.throws(() => MetaInfo.assert(123));
        assert.throws(() => MetaInfo.assert([]));
    });
});
