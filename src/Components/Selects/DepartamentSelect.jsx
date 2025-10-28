import { usePagination } from "../../hooks/usePagination";
import backend from "../../config/backend";
import { Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
const { Option } = Select;

const DepartmentSelect = ({onChange, size, value, placeholder}) => {
  const urlDepartments = backend + "/departments"
  const {
    data: departments,
    isLoading: isLoadingDepartments,
    nextPage: nextPagedepartments,
    hasMore: hasMoreDepartments,
    setData: setDepartmentsData,
    changePath: setPathDepartments,
    fecthInit: fetchInitDepartments,
    loadFirst: isLoadDepartments
  } = usePagination(urlDepartments, false);
  const [findText, setFindText] = useState("")

  const handleScrolldepartmentss = (e) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (hasMoreDepartments) {
        nextPagedepartments()
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
    fetchInitDepartments()
  }

  useEffect(() => {
      const timerId = setTimeout(() => {
        if(isLoadDepartments){
          setDepartmentsData([]);
          setPathDepartments(`${urlDepartments}?find=${findText}`)
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
        onPopupScroll={handleScrolldepartmentss}
        filterOption={false}
        onDropdownVisibleChange={fetchInitData}
      >
        {departments.map((t) => (
          <Option key={t.id} value={t.id}>
            {t.name}
          </Option>
        ))}
        {isLoadingDepartments ?? (
          <Option>
            <Spin size="small" />
          </Option>
        )}
      </Select>
    </>
  );
};

export default DepartmentSelect