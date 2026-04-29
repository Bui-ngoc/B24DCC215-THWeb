import React, { useState, useEffect, useCallback } from 'react';
import { Input, Space, Tag, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';

const { Text } = Typography;

interface FilterBarProps {
  tags: Blog.Tag[];
  activeTagId?: string;
  onSearch: (keyword: string) => void;
  onTagChange: (tagId: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ tags, activeTagId, onSearch, onTagChange }) => {
  const [searchValue, setSearchValue] = useState('');

  // Debounce search function 300ms
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    debouncedSearch(val);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Input
          placeholder="Tìm kiếm bài viết..."
          size="large"
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchValue}
          onChange={handleSearchChange}
          allowClear
        />

        {tags.length > 0 && (
          <Space wrap align="center">
            <Text strong style={{ marginRight: 8 }}>Lọc theo Tag:</Text>
            <Tag.CheckableTag
              checked={!activeTagId}
              onChange={() => onTagChange('')}
              style={{ fontSize: 14, padding: '4px 12px' }}
            >
              Tất cả
            </Tag.CheckableTag>
            
            {tags.map(tag => (
              <Tag.CheckableTag
                key={tag.id}
                checked={activeTagId === tag.id}
                onChange={() => onTagChange(tag.id)}
                style={{ fontSize: 14, padding: '4px 12px' }}
              >
                {tag.name}
              </Tag.CheckableTag>
            ))}
          </Space>
        )}
      </Space>
    </div>
  );
};

export default FilterBar;
