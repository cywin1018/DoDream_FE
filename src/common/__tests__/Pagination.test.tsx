import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from '../Pagination';

// Arrow SVG 컴포넌트 모킹
jest.mock('@assets/icons/arrow.svg?react', () => () => (
  <div data-testid="arrow-icon">화살표</div>
));

describe('Pagination 컴포넌트', () => {
  // window.scrollTo 모킹
  const scrollToMock = jest.fn();
  beforeEach(() => {
    window.scrollTo = scrollToMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('현재 페이지에 해당하는 버튼이 보라색으로 강조되어야 한다', () => {
    render(
      <Pagination
        totalPages={20}
        currentPage={2} // 1-based: 두 번째 페이지
        setCurrentPage={() => {}}
      />
    );

    // 현재 페이지(2번) 버튼이 보라색
    const currentPageButton = screen.getByText('2');
    expect(currentPageButton).toHaveClass('text-purple-500');

    // 다른 페이지(3번) 버튼은 회색
    const otherPageButton = screen.getByText('3');
    expect(otherPageButton).toHaveClass('text-gray-500');
  });

  it('페이지 버튼을 클릭하면 setCurrentPage가 호출되어야 한다', () => {
    const setCurrentPageMock = jest.fn();
    render(
      <Pagination
        totalPages={20}
        currentPage={1} // 1-based 시작은 1
        setCurrentPage={setCurrentPageMock}
      />
    );

    // 5번 페이지 버튼 클릭
    fireEvent.click(screen.getByText('5'));

    // setCurrentPage(5) 호출
    expect(setCurrentPageMock).toHaveBeenCalledWith(5);
    // 스크롤도 호출
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('현재 페이지 버튼을 클릭하면 setCurrentPage가 호출되지 않아야 한다', () => {
    const setCurrentPageMock = jest.fn();
    render(
      <Pagination
        totalPages={20}
        currentPage={2}
        setCurrentPage={setCurrentPageMock}
      />
    );

    // 현재 페이지(2번) 버튼 클릭
    fireEvent.click(screen.getByText('2'));

    // 호출 없어야 함
    expect(setCurrentPageMock).not.toHaveBeenCalled();
  });

  it('첫 번째 페이지 그룹에서는 이전 그룹 버튼이 표시되지 않아야 한다', () => {
    render(
      <Pagination totalPages={20} currentPage={4} setCurrentPage={() => {}} />
    );

    // 화살표 아이콘은 한 개만 (다음 그룹)
    const arrowIcons = screen.getAllByTestId('arrow-icon');
    expect(arrowIcons).toHaveLength(1);
  });

  it('두 번째 이상의 페이지 그룹에서는 이전 그룹 버튼이 표시되어야 한다', () => {
    render(
      <Pagination
        totalPages={30}
        currentPage={11} // 11번 → 두 번째 그룹
        setCurrentPage={() => {}}
      />
    );

    // 화살표 아이콘 두 개 (이전 + 다음)
    const arrowIcons = screen.getAllByTestId('arrow-icon');
    expect(arrowIcons).toHaveLength(2);
  });

  it('마지막 페이지 그룹에서는 다음 그룹 버튼이 표시되지 않아야 한다', () => {
    render(
      <Pagination totalPages={20} currentPage={19} setCurrentPage={() => {}} />
    );

    // 화살표 아이콘 한 개만 (이전 그룹)
    const arrowIcons = screen.getAllByTestId('arrow-icon');
    expect(arrowIcons).toHaveLength(1);
  });

  it('다음 그룹 버튼을 클릭하면 다음 그룹의 첫 페이지로 이동해야 한다', () => {
    const setCurrentPageMock = jest.fn();
    render(
      <Pagination
        totalPages={30}
        currentPage={4}
        setCurrentPage={setCurrentPageMock}
      />
    );

    // 다음 그룹 버튼 클릭
    const nextGroupButton = screen.getByTestId('arrow-icon');
    fireEvent.click(nextGroupButton.parentElement as HTMLElement);

    // 11번 호출
    expect(setCurrentPageMock).toHaveBeenCalledWith(11);
  });

  it('이전 그룹 버튼을 클릭하면 이전 그룹의 마지막 페이지로 이동해야 한다', () => {
    const setCurrentPageMock = jest.fn();
    render(
      <Pagination
        totalPages={30}
        currentPage={14}
        setCurrentPage={setCurrentPageMock}
      />
    );

    // 이전 그룹 버튼 클릭 (첫 번째 화살표)
    const arrowIcons = screen.getAllByTestId('arrow-icon');
    fireEvent.click(arrowIcons[0].parentElement as HTMLElement);

    // 10번 호출
    expect(setCurrentPageMock).toHaveBeenCalledWith(10);
  });

  it('페이지 수가 10개 이하일 때 모든 페이지 버튼이 표시되어야 한다', () => {
    render(
      <Pagination totalPages={7} currentPage={2} setCurrentPage={() => {}} />
    );

    // 1~7번 버튼 모두 렌더링
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('페이지 그룹이 변경될 때 적절한 페이지 버튼들이 표시되어야 한다', () => {
    const { rerender } = render(
      <Pagination totalPages={30} currentPage={4} setCurrentPage={() => {}} />
    );

    // 첫 그룹: 1~10
    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }

    // 두 번째 그룹으로 변경
    rerender(
      <Pagination totalPages={30} currentPage={14} setCurrentPage={() => {}} />
    );

    // 두 번째 그룹: 11~20
    for (let i = 11; i <= 20; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });
});
