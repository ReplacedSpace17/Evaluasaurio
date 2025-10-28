import { usePagination } from "../../hooks/usePagination";
import backend from "../../config/backend";
import { Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
const { Option } = Select;

const SubjectSelect = ({onChange, size, value, placeholder}) => {
  const urlsubjects = backend + "/subjects"
  const {
    data: subjects,
    isLoading: isLoadingsubjects,
    nextPage: nextPagesubjects,
    hasMore: hasMoresubjects,
    setData: setSubjectData,
    changePath: setPathSubject,
    fecthInit: fetchInitSubjects,
    loadFirst: isLoadSubjects
  } = usePagination(urlsubjects, false);
  const [findText, setFindText] = useState("")

  const handleScrollsubjects = (e) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (hasMoresubjects) {
        nextPagesubjects()
      }
    }
  }

  const handleSelectChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue) 
    }
  }

  const handleSearch = useCallback((text) => {
      setFindText(text)
    }, [])

  const fetchInitData = () => {
    fetchInitSubjects()
  }

  useEffect(() => {
      const timerId = setTimeout(() => {
        if(isLoadSubjects){
          setSubjectData([]);
          setPathSubject(`${urlsubjects}?find=${findText}`)
        }
      }, 500);
  
      return () => {
        clearTimeout(timerId);
      };
    }, [findText]);
  
  return (
    <>
      <Select
        size={size}
        showSearch
        allowClear
        placeholder={placeholder}
        style={{ width: "100%" }}
        value={value}
        onChange={handleSelectChange}
        onSearch={handleSearch}
        onPopupScroll={handleScrollsubjects}
        filterOption={false}
        onDropdownVisibleChange={fetchInitData}
      >
        {subjects.map((t) => (
          <Option key={t.id} value={t.id}>
            {t.name}
          </Option>
        ))}
        {isLoadingsubjects ?? (
          <Option>
            <Spin size="small" />
          </Option>
        )}
      </Select>
    </>
  );
};

export default SubjectSelect