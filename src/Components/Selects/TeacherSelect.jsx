import { usePagination } from "../../hooks/usePagination";
import backend from "../../config/backend";
import { Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
const { Option } = Select;

const TeacherSelect = ({ 
  onChange, 
  size, 
  value, 
  placeholder, 
  disabled = false, 
}) => {
  const urlTeachers = backend + "/teachers?limit=20";
  const {
    data: teachers,
    isLoading: isLoadingTeachers,
    nextPage: nextPageTeachers,
    hasMore: hasMoreTeachers,
    changePath: setPathTeacher,
    setData: setTeachersData,
    fecthInit: fetchInitTeachers,
    loadFirst: isLoadTachers
  } = usePagination(urlTeachers, false);
  const [findText, setFindText] = useState("");

  const handleScrollTeachers = (e) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      if (hasMoreTeachers) {
        nextPageTeachers();
      }
    }
  };

  //Sobreescribir su comportamiento segun sea necesario
  const handleSelectChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  const handleSearch = useCallback((text) => {
    setFindText(text);
  }, []);

  const fetchInitData = () => {
    if(!disabled){
      fetchInitTeachers();
    }
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      if(isLoadTachers && !disabled){
        setTeachersData([]);
        setPathTeacher(`${urlTeachers}&find=${findText}`);
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
        onSearch={handleSearch}
        onChange={handleSelectChange}
        filterOption={false}
        onPopupScroll={handleScrollTeachers}
        onDropdownVisibleChange={fetchInitData}
        disabled={disabled}
      >
        {teachers.map((t) => (
          <Option key={t.id} value={t.id}>
            {t.name} {t.apellido_paterno} {t.apellido_materno}
          </Option>
        ))}
        {isLoadingTeachers ?? (
          <Option>
            <Spin size="small" />
          </Option>
        )}
      </Select>
    </>
  );
};

export default TeacherSelect;
