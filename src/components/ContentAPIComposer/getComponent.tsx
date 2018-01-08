import React from 'react';
import StaffList from '~components/StaffList';
import HeadingHero from '~components/HeadingHero';
import SelectionGrid from '~components/SelectionGrid';
import SelectionGridItem from '~components/SelectionGridItem';
import {CMSDocument, ComponentBlock, ComponentMap} from "../../types/content";

/* eslint-disable react/prop-types */
const components: ComponentMap = {
  heading: ({ value }) => <h1>{value}</h1>,
  heading_hero: ({ value, document }) => (
    <HeadingHero
      title={value.heading || document.title}
      imageURL={value.image.resource}
    />
  ),
  staff_list: StaffList,
  selection_grid: ({ value }) => (
    <SelectionGrid>
      {value.map((item: any) => ( // todo
        <SelectionGridItem
          title={item.title}
          link={item.link}
          imageURL={item.image.resource}
        />
      ))}
    </SelectionGrid>
  ),
  paragraph: ({ value }) => (
    <div className="Prose" dangerouslySetInnerHTML={{ __html: value }} />
  ),
};

export default function getComponent(component: ComponentBlock, data: CMSDocument, key: number) {
  if (!Object.hasOwnProperty.call(components, component.type)) {
    console.warn(
      `[contentAPI] Requested component not found! ${
        component.type
      } is missing.`
    );
    return null;
  }

  return React.createElement(components[component.type], {
    value: component.value,
    document: data,
    key,
  });
}

/* eslint-enable react/prop-types */