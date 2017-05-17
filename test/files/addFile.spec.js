import watch from 'watch'
import path from 'path'
import {addFile, INVALID_BOOK_ERROR, INVALID_PAGE_ERROR, ADD_ORIGINAL,
  ADD_THUMBNAIL, ADD_ENTRY} from '../../app/actions/actions'

function expectNotDispatched(relFilePath, fstat) {
  const fn = addFile(relFilePath, fstat)
  const mockDispatch = jest.fn()
  fn(mockDispatch)
  expect(mockDispatch.mock.calls.length).toBe(0);
}

function getMockFstat(props) {
  const fstat = {}
  Object.keys(props).forEach(prop => {
    const mockProperty = jest.fn()
    mockProperty.mockReturnValue(props[prop])
    fstat[prop] = mockProperty
  })
  return fstat
}

function getSyncThunkRes(thunk) {
  let action
  const mockDispatch = res => action = res
  thunk(mockDispatch)
  return action
}

const VALID_BOOK = 'OU.ADUL.F.1.1998'
const VALID_PAGE = 'p051'
const VALID_ORIGINAL = 'OU.ADUL.F.1.1998_p051.jpg'
const VALID_THUMBNAIL = 'OU.ADUL.F.1.1998_p051_thumbnail.jpg'
const VALID_ENTRY = 'entry.json'

describe('Image parsing', () => {
  it('it should parse a valid original file', () => {
    const imagePath = [VALID_BOOK, VALID_PAGE, VALID_ORIGINAL].join(path.sep)
    const fstat = getMockFstat({isDirectory: false})
    const res = getSyncThunkRes(addFile(imagePath, fstat))

    expect(res.type).toBe(ADD_ORIGINAL);
    expect(res.book).toBe('OU.ADUL.F.1.1998');
    expect(res.page).toBe('p051');
    expect(res.fileName).toBe('OU.ADUL.F.1.1998_p051.jpg');
    expect(res.relFilePath).toBe('OU.ADUL.F.1.1998/p051/OU.ADUL.F.1.1998_p051.jpg')
  });

  it('it should parse a valid thumbnail', () => {
    const imagePath = [VALID_BOOK, VALID_PAGE, VALID_THUMBNAIL].join(path.sep)
    const fstat = getMockFstat({isDirectory: false})
    const res = getSyncThunkRes(addFile(imagePath, fstat))

    expect(res.type).toBe(ADD_THUMBNAIL);
    expect(res.book).toBe('OU.ADUL.F.1.1998');
    expect(res.page).toBe('p051');
    expect(res.fileName).toBe('OU.ADUL.F.1.1998_p051_thumbnail.jpg');
    expect(res.relFilePath).toBe('OU.ADUL.F.1.1998/p051/OU.ADUL.F.1.1998_p051_thumbnail.jpg')
  });

  it('it should parse a json file as entry', () => {
    const imagePath = [VALID_BOOK, VALID_PAGE, VALID_ENTRY].join(path.sep)
    const fstat = getMockFstat({isDirectory: false})
    const res = getSyncThunkRes(addFile(imagePath, fstat))

    expect(res.type).toBe(ADD_ENTRY);
    expect(res.book).toBe('OU.ADUL.F.1.1998');
    expect(res.page).toBe('p051');
    expect(res.fileName).toBe('entry.json');
    expect(res.relFilePath).toBe('OU.ADUL.F.1.1998/p051/entry.json')
  });

  it('it should not dispatch if the file is a directory', () => {
    const fstat = getMockFstat({isDirectory: true})
    const VALID_PATH = [VALID_BOOK, VALID_PAGE, VALID_ORIGINAL].join(path.sep)
    expectNotDispatched(VALID_PATH, fstat)
  })

  it('should not dispatch if the path is empty', () => {
    const fstat = getMockFstat({isDirectory: false})
    expectNotDispatched('', fstat)
  })

  it('should not dispatch if the file path does not have a depth of 3 (book, page, file)', () => {
    const fstat = getMockFstat({isDirectory: false})
    expectNotDispatched('test/bla.jpg', fstat)
  })


});
