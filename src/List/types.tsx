import {Stories, Story} from '../types';

export interface ListProps {
  list: Stories;
  onRemoveItem: (item: Story) => void;
}

export interface ItemProps {
  item: Story;
  onRemoveItem: (item: Story) => void;
}