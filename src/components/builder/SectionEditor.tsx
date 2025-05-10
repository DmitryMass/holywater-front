import { type UseSectionEditorProps } from '@hooks/useSectionEditor';

import { DraggableSectionContainer } from './DraggableSectionContainer';

export type SectionEditorProps = UseSectionEditorProps;

const SectionEditor = (props: SectionEditorProps) => {
  return <DraggableSectionContainer {...props} />;
};

export default SectionEditor;
